const { format } = require('date-fns');
const Handlebars = require('handlebars');

module.exports = {
    sum: (a, b) => a + b,
    equal: (a, b) => a === b,
    eq: (a, b) => a.equals(b),
    convertPriority: (key) => {
        switch (key) {
            case '1':
                return 'Thấp';
            case '2':
                return 'Vừa';
            default:
                return "Cao"
        }
    },
    formatDate: (date) => format(date, 'HH:mm dd-MM-yyyy'),
    sortable: (field, sort) => {
        const sortType = field === sort.column ? sort.type : 'default';

        const icons = {
            default: 'fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10"',
            asc: 'd="M3.5 3.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 12.293zm4 .5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1zm0 3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1zm0 3a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1zM7 12.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5"',
            desc: 'd="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z"'
        };

        const types = {
            default: 'desc',
            asc: 'desc',
            desc: 'asc'
        };

        const icon = icons[sortType];
        const type = types[sortType];

        const href = Handlebars.escapeExpression(`?_sort&column=${field}&type=${type}`);
        const result = `<a href = "${href}" >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"viewBox="0 0 16 16">
                  <path ${icon}/>
                </svg>
              </a>`;
        return new Handlebars.SafeString(result);
    },
    getPriorityClass: (priority) => {
        switch (priority) {
            case '3':
                return 'badge-info'; 
            case '2':
                return 'badge-warning'; 
            case '1':
                return 'badge-secondary';
            default:
                return 'badge-secondary';
        }
    },
    range: (start, end) => {
        const range = [];
        for (let i = start; i <= end; i++) {
            range.push(i);
        }
        return range;
    },
    add:(a, b) => a + b,
    subtract: (a, b) => a - b,
    gt: (a, b) => a > b,
    lt: (a, b) => a < b,
};