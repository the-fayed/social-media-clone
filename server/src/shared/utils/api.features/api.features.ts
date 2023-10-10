import { Paginate, ReqQuery } from "./api.features.interfaces";

class ApiFeatures {
  reqQuery: ReqQuery;
  dbQuery: any;
  paginationResult: Paginate;
  constructor(dbQuery: any, reqQuery: ReqQuery) {
    this.reqQuery = reqQuery;
    this.dbQuery = dbQuery;
    this.paginationResult = {
      currentPage: 0,
      limit: 0,
      documentCount: 0,
      previousPage: 0,
      nextPage: 0,
    };
  }

  // pagination
  paginate(documentCount: number): this {
    const page = this.reqQuery.page || 1;
    const size = this.reqQuery.size || 10;
    const skip = (page - 1) * size;
    const endIndex = page * size;
    // pagination results
    this.paginationResult.currentPage = Number(page);
    this.paginationResult.limit = endIndex;
    this.paginationResult.documentCount = documentCount;
    if (endIndex < documentCount) {
      this.paginationResult.nextPage = Number(this.paginationResult.currentPage) + 1;
    }
    if (skip > 0) {
      this.paginationResult.previousPage = Number(this.paginationResult.currentPage) - 1;
      this.dbQuery = this.dbQuery({ skip: skip, take: size });
    }
    return this;
  }
  // sorting
  sort(): this {
    if (this.reqQuery.sortBy) {
      let sortByObj: string;
      if (this.reqQuery.sortBy.startsWith("-")) {
        sortByObj = this.reqQuery.sortBy.slice(0);
        console.log(sortByObj);
        this.dbQuery = this.dbQuery({
          orderBy: {
            sortByObj: "asc",
          },
        });
        return this;
      }
      if (this.reqQuery.sortBy.startsWith("+")) {
        sortByObj = this.reqQuery.sortBy.slice(0);
        this.dbQuery = this.dbQuery({
          orderBy: {
            sortByObj: "desc",
          },
        });
        return this;
      }
    }else {
      this.dbQuery({orderBy: {
        createAt: 'desc'
      }})
    }
  }
}

export default ApiFeatures;
