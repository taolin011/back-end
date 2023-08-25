class ApiFeatures {
  constructor(query, queryParams) {
    this.query = query
    this.queryParams = queryParams
  } 

  // 过滤特定字段
  filter() {
    // 拷贝对象
    const queryObj = {...this.queryParams}
    // 排除字段
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'title']
    excludedFields.forEach(el => delete queryObj[el])
    // 查询
    this.query = this.query.find(queryObj)
    
    return this
  }

  // 排序
  sort() {
    if(this.queryParams.sort){
      const sortBy = this.queryParams.sort.split(',').join(' ')
      this.query = this.query.sort(sortBy)
    } 

    return this
  }

  // 字段限制
  limitFields() {
    if (this.queryParams.fields) {
      const fields = this.queryParams.fields.split(',').join(' ')
      this.query = this.query.select(fields)
    } else {
      this.query = this.query.select('-__v')
    }

    return this
  }

  // 分页
  paginate() {
    const page = Number(this.queryParams.page) || 1
    const limit = Number(this.queryParams.limit) || 100
    const skip = (page - 1) * limit
    
    // page=2&limit=10, 1-10 page1, 11-20 page2, 21-30 page3
    this.query = this.query.skip(skip).limit(limit)

    return this
  }

  // 标题模糊查询
  titleSearch() {
    if (this.queryParams.title) {
      const title = this.queryParams.title
      // $options：'i' 忽略大小写
      this.query = this.query.find({ title: { $regex: title, $options: 'i' } })
    }

    return this
  }

}

module.exports = ApiFeatures

