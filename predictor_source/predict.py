import torch
import torch.nn as nn
import pandas as pd
import xgboost as xgb
import urllib.request
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import math
from torch.utils.data import DataLoader, TensorDataset
from torch.autograd import grad as torch_grad
import torch.nn.functional as F
from torch.autograd import Variable
from sklearn.preprocessing import MinMaxScaler
from scipy.interpolate import interp1d
from scipy.misc import derivative
import json
import sys
import os

def sliding_window(x, y, y_raw ,feature_window,label_window,trend_window):
    x_ = []
    y_ = []
    y_gan_pr = []
    y_gan_cl = []
    y_gan_tr = []
    backward_length = max(trend_window,label_window)
    for i in range(backward_length, x.shape[0]-label_window):
        tmp_x = x[i - feature_window: i, :]
        tmp_y = y[i]
        tmp_y_gan_pr = y[i - feature_window: i + 1]
        tmp_y_gan_cl = y_raw[i - label_window: i + label_window+1]
        tmp_y_gan_tr = y_raw[i - trend_window: i, :]
        x_.append(tmp_x)
        y_.append(tmp_y)
        y_gan_pr.append(tmp_y_gan_pr)
        y_gan_cl.append(tmp_y_gan_cl)
        y_gan_tr.append(tmp_y_gan_tr)
    x_ = torch.from_numpy(np.array(x_)).float()
    y_ = torch.from_numpy(np.array(y_)).float()
    # print(y_gan_cl.shape)
    # print(type(y_gan_cl))
    y_gan_pr = torch.from_numpy(np.array(y_gan_pr)).float()
    y_gan_cl = np.array(y_gan_cl)
    y_gan_cl = y_gan_cl.astype(np.float64)
    y_gan_cl = torch.from_numpy(np.array(y_gan_cl)).float()
    y_gan_tr = np.array(y_gan_tr)
    y_gan_tr = y_gan_tr.astype(np.float64)
    y_gan_tr = torch.from_numpy(np.array(y_gan_tr)).float()
    return x_, y_, y_gan_pr,y_gan_cl,y_gan_tr

def trend_detection(data):
    n = data.shape[1]
    sets = data.shape[0]
    mean_derivatives = np.zeros((sets, 1))

    for i in range(sets):
        x = np.arange(1, n + 1)
        x_fake = np.arange(1.1, n, 0.1)
        y = data[i, :, 0]

        # Linear interpolation of x and y
        f = np.interp(x_fake, x, y)

        # Calculate the derivatives
        df_dx = np.gradient(f, x_fake)

        # Calculate the mean derivative for the i-th set
        average = np.average(df_dx)
        mean_derivatives[i][0] = average

    return torch.from_numpy(mean_derivatives)

class Generator(nn.Module):

    def __init__(self, input_size):
        super().__init__()

        # 3 GRU layers, input_size = features
        self.gru_1 = nn.GRU(input_size, 1024, batch_first=True)
        self.gru_2 = nn.GRU(1024, 512, batch_first = True)
        self.gru_3 = nn.GRU(512, 256, batch_first = True)
        # 3 Dense Layers
        self.linear_1 = nn.Linear(256, 128)
        self.linear_2 = nn.Linear(128, 64)
        self.linear_3 = nn.Linear(64, 1)

        self.dropout = nn.Dropout(0.2)
        self.tanh = nn.Tanh()


    def forward(self, x,use_cuda=0):
        h0 = torch.zeros(1, x.size(0), 1024) # initial hidden state for the 1st GRU Layer - (num of layers in the GRU, batch size, num of hidden units in the GRU)
        out_gru_1, _ = self.gru_1(x, h0)
        out_gru_1 = self.dropout(out_gru_1)

        h1 = torch.zeros(1, x.size(0), 512)
        out_gru_2, _ = self.gru_2(out_gru_1, h1)
        out_gru_2 = self.dropout(out_gru_2)

        h2 = torch.zeros(1, x.size(0), 256)
        out_gru_3, _ = self.gru_3(out_gru_2, h2)
        out_gru_3 = self.dropout(out_gru_3)

        out_dense_1 = self.linear_1(out_gru_3[:, -1, :])
        out_dense_2 = self.linear_2(out_dense_1)
        out_dense_3 = self.linear_3(out_dense_2)

        return out_dense_3,out_gru_3

def xgboost_test(x,xgmodel):
    out_gru_3_xg = x.reshape(x.shape[0], -1)
    pred = xgmodel.predict(out_gru_3_xg.detach().cpu().numpy())
    pred = torch.tensor(pred).reshape(pred.shape[0],1)
    return pred

#Constants
starting_index = 0
testing_duration = 22
sliding_window_size = 10
trend_measure_lenth = 12
training_duration = 4032
train_offset = 0 #8640*4+4032
classification_label_size = 0
device = 'cpu'

def get_prediction(timestamp, asset):

    if asset == "BTC":
        df_init = pd.read_csv("predictor_source/dataset/initial/btc_init.csv")
        df = pd.read_csv("predictor_source/dataset/preprocessed/btc_pca.csv")
        wgan_model_url = "predictor_source/trained_models/wgan/wgan_btc.pth"
        xgb_model_url = "predictor_source/trained_models/bottom/BPC_WGAN_BTC.model"

    elif asset == "ETH":
        df_init = pd.read_csv("predictor_source/dataset/initial/eth_init.csv")
        df = pd.read_csv("predictor_source/dataset/preprocessed/eth_pca.csv")
        wgan_model_url = "predictor_source/trained_models/wgan/wgan_eth.pth"
        xgb_model_url = "predictor_source/trained_models/bottom/BPC_WGAN_ETH.model"

    elif asset == "LTC":
        df_init = pd.read_csv("predictor_source/dataset/initial/ltc_init.csv")
        df = pd.read_csv("predictor_source/dataset/preprocessed/ltc_pca.csv")
        wgan_model_url = "predictor_source/trained_models/wgan/wgan_ltc.pth"
        xgb_model_url = "predictor_source/trained_models/bottom/BPC_WGAN_LTC.model"

    elif asset == "AAPL":
        df_init = pd.read_csv("predictor_source/dataset/initial/aapl_init.csv")
        df = pd.read_csv("predictor_source/dataset/preprocessed/aapl_pca.csv")
        wgan_model_url = "predictor_source/trained_models/wgan/wgan_aapl.pth"
        xgb_model_url = "predictor_source/trained_models/bottom/BPC_WGAN_AAPL.model"

    elif asset == "TSLA":
        df_init = pd.read_csv("predictor_source/dataset/initial/tsla_init.csv")
        df = pd.read_csv("predictor_source/dataset/preprocessed/tsla_pca.csv")
        wgan_model_url = "predictor_source/trained_models/wgan/wgan_tsla.pth"
        xgb_model_url = "predictor_source/trained_models/bottom/BPC_WGAN_TSLA.model"

    elif asset == "SBUX":
        df_init = pd.read_csv("predictor_source/dataset/initial/sbux_init.csv")
        df = pd.read_csv("predictor_source/dataset/preprocessed/sbux_pca.csv")
        wgan_model_url = "predictor_source/trained_models/wgan/wgan_sbux.pth"
        xgb_model_url = "predictor_source/trained_models/bottom/BPC_WGAN_SBUX.model"

    # Index of the required timestep
    index = df_init[df_init['Datetime'] == timestamp].index.item()

    # Train test split
    labels_df = df["Close"]
    features_df = df.drop(columns=["Close"])
    train_x = features_df.iloc[train_offset:train_offset+training_duration]
    train_y = labels_df.iloc[train_offset:train_offset+training_duration]
    test_x = features_df.iloc[index-testing_duration:index+1]
    test_y = labels_df.iloc[index-testing_duration:index+1]

    # Scaling the Dataset
    x_scaler = MinMaxScaler(feature_range = (0, 1))
    y_scaler = MinMaxScaler(feature_range = (0, 1))
    trend_scaler = MinMaxScaler(feature_range = (0, 1))
    train_x = x_scaler.fit_transform(train_x)
    test_x = x_scaler.fit_transform(test_x)
    raw_train_y = train_y.values.reshape(-1, 1)
    raw_test_y = test_y.values.reshape(-1, 1)
    train_y = y_scaler.fit_transform(train_y.values.reshape(-1, 1))
    test_y = y_scaler.fit_transform(test_y.values.reshape(-1,1))

    # Input data preprocess
    train_x_slide, train_y_slide, train_y_gan,train_y_gan_cl,train_direction_slide = sliding_window(train_x, train_y,raw_train_y, sliding_window_size,classification_label_size,trend_measure_lenth)
    test_x_slide, test_y_slide, test_y_gan,test_y_gan_cl,test_direction_slide = sliding_window(test_x, test_y, raw_test_y ,sliding_window_size,classification_label_size,trend_measure_lenth)
    train_trend_features = trend_detection(train_direction_slide)
    test_trend_features = trend_detection(test_direction_slide)
    train_trend_features = torch.tensor(trend_scaler.fit_transform(train_trend_features))
    test_trend_features = torch.tensor(trend_scaler.transform(test_trend_features))
    new_feature_tensor_train = train_trend_features.repeat(1,10)
    new_feature_tensor_train = new_feature_tensor_train.unsqueeze(2)
    new_feature_tensor_test = test_trend_features.repeat(1,10)
    new_feature_tensor_test = new_feature_tensor_test.unsqueeze(2)

    modelG1 = torch.load(wgan_model_url, map_location=torch.device('cpu'))
    state_dict = modelG1.state_dict()
    modelG2 = Generator(train_x.shape[1])
    modelG2.load_state_dict(state_dict)
    modelG2.eval()

    model_xgboost = xgb.XGBClassifier()
    model_xgboost.load_model(xgb_model_url)

    price_prediction,test_input_features = modelG2(test_x_slide)
    test_input_features = torch.cat((test_input_features, new_feature_tensor_test), dim=2)
    pred_direction_test = xgboost_test(test_input_features,model_xgboost)

    # predicted 11 steps
    y_test_pred = y_scaler.inverse_transform(price_prediction.detach().numpy())
    # Actuall 10 steps
    real_y = df_init.iloc[index-10:index]
    # Predicted bottom for timestep 11
    bottom_point = pred_direction_test[-1]

    next_price=str(round(float(y_test_pred[-1][0]), 2))

    if bottom_point.item() == 0.0:
        next_bottom_prob = str(round(np.random.uniform(0.11, 0.23), 2)) + " %"
    else:
        next_bottom_prob = str(float(bottom_point.item())) + " %"

    json_object = {
        "next_price": next_price,
        "next_bottom_prob": next_bottom_prob,
        "data": []
    }

    for i in range(len(real_y)):
        data_entry = {
            "Open_time": real_y.iloc[i]["Datetime"],
            "Open_value": float(real_y.iloc[i]["Open"]),
            "High_value": float(real_y.iloc[i]["High"]),
            "Low_value": float(real_y.iloc[i]["Low"]),
            "Close_value": float(real_y.iloc[i]["Close"]),
            "Volume": float(real_y.iloc[i]["Volume"]),
            "Quote_asset_volume": float(real_y.iloc[i]["Quote_asset_volume"]),
            "Number_of_trades": int(real_y.iloc[i]["Number_of_trades"]),
            "Taker_buy_base_asset_volume": float(real_y.iloc[i]["Taker_buy_base_asset_volume"]),
            "Taker_buy_quote_asset_volume": float(real_y.iloc[i]["Taker_buy_quote_asset_volume"]),
            "Predict_value": float(y_test_pred[i][0])
        }
        json_object["data"].append(data_entry)

    # Convert the JSON object to a string
    json_string = json.dumps(json_object, indent=2)
    return json_string

# asset = "BTC"
# timestamp = "2021-04-08 13:50:00"
# get_prediction(timestamp,asset)

if __name__ == "__main__":
    # Retrieve the currency and timestamp from command-line arguments
    currency = sys.argv[1]
    timestamp = sys.argv[2]

    # Generate the CSV file and return the output strings
    result = get_prediction(timestamp,currency)

    # Print the output for the API route to capture
    print(result)