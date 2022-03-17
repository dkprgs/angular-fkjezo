import { Component, ViewEncapsulation } from '@angular/core';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { State } from '@progress/kendo-data-query/dist/npm/state';

@Component({
    selector: 'my-app',
    /*
     * Set a fixed row height of 36px (20px line height, 2 * 8px padding)
     *
     * [row height] = [line height] + [padding] + [border]
     *
     * Note: If using the Kendo UI Material theme, add 1px to the row height
     * to account for the bottom border width.
     */
    encapsulation: ViewEncapsulation.None,
    styles: [
        `
            .k-grid tbody td {
                white-space: nowrap;
                line-height: 20px;
                padding: 8px 12px;
            }

            input[type='radio'] {
                margin-right: 5px;
            }
        `
    ],
    template: `
        <div class="example-config">
            <div class="row">
                <div class="col m-2">
                    <button kendoButton (click)="loadProducts()">Load 100000 Items</button>
                </div>
            </div>

            <div class="row">
                <div class="col m-2">
                    <ul class="k-radio-list">
                        <li class="k-radio-item">
                            <input
                                kendoRadioButton
                                type="radio"
                                #virtual
                                [(ngModel)]="mode"
                                value="virtual"
                                (change)="changeMode(mode)"
                            />
                            <kendo-label [for]="virtual" text="Virtual Scrolling"></kendo-label>
                        </li>
                        <li class="k-radio-item">
                            <input
                                kendoRadioButton
                                type="radio"
                                #paging
                                [(ngModel)]="mode"
                                value="paging"
                                (change)="changeMode(mode)"
                            />
                            <kendo-label [for]="paging" text="Paging"></kendo-label>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <kendo-grid
            *ngIf="isVirtual"
            [data]="gridView"
            [skip]="state.skip"
            [pageSize]="state.take"
            scrollable="virtual"
            [rowHeight]="36"
            [height]="420"
            [sortable]="true"
            [sort]="state.sort"
            [virtualColumns]="true"
            (dataStateChange)="onDataChange($event)"
        >
            <kendo-grid-column *ngFor="let column of columns" [field]="column.field" [title]="column.title" [width]="column.width">
            </kendo-grid-column>
        </kendo-grid>

        <kendo-grid
            *ngIf="!isVirtual"
            [data]="gridView"
            [skip]="state.skip"
            [pageSize]="state.take"
            pageable="true"
            [height]="420"
            [sortable]="true"
            [sort]="state.sort"
            [virtualColumns]="true"
            (dataStateChange)="onDataChange($event)"
        >
            <kendo-grid-column *ngFor="let column of columns" [field]="column.field" [title]="column.title" [width]="column.width">
            </kendo-grid-column>
        </kendo-grid>
    `
})
export class AppComponent {
    public isVirtual = true;
    public gridView: GridDataResult;
    public data: any[];
    public mode = 'virtual';

    public state: State = {
        skip: 0,
        take: 40,
        sort: []
    };

    public numberOfRows = 100000;
    public numberOfColumns = 100;

    /* Generating Grid Columns */
    public columns = (() => {
        const cols = [{ field: 'id', title: 'ID', width: 80 }];
        for (let c = 1; c <= this.numberOfColumns; c++) {
            cols.push({
                field: `Field_${c}`,
                width: 150,
                title: `Field-${c}`
            });
        }
        return cols;
    })();

    constructor() {
        this.data = this.getData(0, this.numberOfRows);
    }

    public changeMode(newMode: string) {
        this.isVirtual = newMode === 'paging' ? false : true;
        this.state.take = this.isVirtual ? 40 : 15;
        this.state.skip = 0;

        if (this.gridView) {
            this.loadProducts();
        }
    }

    public onDataChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.loadProducts();
    }

    private loadProducts(): void {
        this.gridView = process(this.data, this.state);
    }

    /* Generating Grid Data */
    public getData = (skip: number, take: number) => {
        const page: any = [];
        for (let r = skip + 1; r <= skip + take && r <= this.numberOfRows; r++) {
            const row = { id: r };
            for (let c = 1; c <= this.numberOfColumns; c++) {
                row[`Field_${c}`] = `R${r} : C${c}`;
            }
            page.push(row);
        }
        return page;
    }
}
