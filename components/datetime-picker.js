// import React, { useState } from 'react';
// import DateFnsUtils from '@date-io/date-fns';
// import {
//     MuiPickersUtilsProvider,
//     KeyboardDateTimePicker,
// } from '@material-ui/pickers';
//
// export function DTP() {
//     const [selectedDate, setSelectedDate] = useState(new Date());
//
//     const handleDateChange = (date) => {
//         setSelectedDate(date);
//     };
//
//     return (
//         <MuiPickersUtilsProvider utils={DateFnsUtils}>
//             <KeyboardDateTimePicker
//                 disableToolbar
//                 variant="inline"
//                 format="MM/dd/yyyy HH:mm"
//                 margin="normal"
//                 id="datetime-picker-inline"
//                 //label="Date and Time picker inline"
//                 value={selectedDate}
//                 onChange={handleDateChange}
//                 KeyboardButtonProps={{
//                     'aria-label': 'Change date and time',
//                 }}
//                 minutesStep={5}
//                 style={{ width: '280px' }}
//                 ampm={false}
//                 views={['date', 'hours', 'minutes']}
//             />
//         </MuiPickersUtilsProvider>
//     );
// }
