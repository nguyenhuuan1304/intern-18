import React from 'react';

interface CurrencyFormatterProps {
    amount: number;
}

const CurrencyFormatter: React.FC<CurrencyFormatterProps> = ({ amount }) => {
    const formattedAmount = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);

    return <span>{formattedAmount}</span>;
};

export default CurrencyFormatter;
