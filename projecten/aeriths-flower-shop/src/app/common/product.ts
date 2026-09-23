export class Product {

    constructor(public id: number,
                public name: string,
                public price: number,
                public imgUrl: string,
                public categoryId: number,
                public available: boolean,
                public unitsInStock: number,
                public description: string,
                public transName?: string,
                public transDescription?: string
        ) {
    }
}