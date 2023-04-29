import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';


export function DTP() {
    const [value, onChange] = useState(new Date());

    return (
        <DateTimePicker
            onChange={onChange}
            value={value}
            className="custom-dtp"/>
    );
}
