import sys
import csv
import json


def predict_currency(currency, timestamp):

    with open('./BTCUSDT_dummy.json', 'r') as file:
        # Read the JSON data
        json_data = json.load(file)

    return json_data, '425', '23.35'

if __name__ == "__main__":
    # Retrieve the currency and timestamp from command-line arguments
    currency = sys.argv[1]
    timestamp = sys.argv[2]

    # Generate the CSV file and return the output strings
    data_file, next_price, next_bottom_prob = predict_currency(currency, timestamp)

    # Print the output for the API route to capture
    print(f'{data_file},{next_price},{next_bottom_prob}')

