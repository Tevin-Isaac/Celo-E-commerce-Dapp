/* eslint-disable import/no-anonymous-default-export */
export default {
    formatCurrency: function (num) {
        return '$' + Number(num.toFixed(1)).toLocaleString() + ' ';
    }
}