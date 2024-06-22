export class HtmlTable {
    constructor(container, columnsQty, data, header) {
        this.container = document.getElementById(container);
        this.table = document.createElement('table');
        this.thead = document.createElement('thead');
        this.tbody = document.createElement('tbody');
        this.columnsQty = columnsQty;
        this.header = header; // array of column labels
        this.data = data // array of row's data

        this.buildTable();
    }

    buildTable() {
        const row = document.createElement('tr');

        for (let i = 0; i < this.columnsQty / this.header.length; i++) {

            this.header.forEach(item => {
                const th = document.createElement('th');
                th.textContent = item;
                row.appendChild(th)
            })
        }

        this.thead.appendChild(row);
        this.table.appendChild(this.thead);

        this.data.forEach(rowItem => {
            const row = document.createElement('tr');

            if (typeof(rowItem) === 'string') {
                const td = document.createElement('td');
                td.setAttribute('colspan', String(this.columnsQty))
                td.textContent = rowItem;
                td.classList.add('text-center');
                row.appendChild(td);
            } else if (typeof(rowItem) === 'object') {
                rowItem.forEach(item => {
                    const td = document.createElement('td');
                    td.textContent = item;
                    row.appendChild(td);
                })
            }

            this.tbody.appendChild(row);
        })

        this.table.appendChild(this.tbody);
        this.container.appendChild(this.table);
    }
}