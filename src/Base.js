import inflection from 'inflection'
import TotalResourceError from './TotalResourceError'

class Base {
  #params
  
  constructor (params) {
    this.#params = params
  }

  attributes (attributes) {
    attributes.forEach(attribute => {
      this[attribute] = this.#params[attribute]
    })
  }

  hasMany (resource, Model) {
    if (this.#params[resource]) {
      this[resource] = []
      this.#params[resource].forEach(item => {
        this[resource].push(new Model(item))
      })
    }
  }

  belongsTo (resource, Model) {
    if (this.#params[resource]) {
      this[resource] = new Model(this.#params[resource])
    }
  }

  static async find(id) {
    let resource = null
    try {
      let response = await this.axios.get(`/${this.resourceNamePlural}/${id}`)
      resource = new this(response.data[this.classNameCamelized])
    } catch (error) {
      throw new TotalResourceError(error.message, 'total_resource_error')      
    }
    return resource
  }

  static async all (queryParams, options = {}) {
    let url = options.customUrl ? options.customUrl : this.resourceNamePlural

    let resources

    try {
      let response = await this.axios.get(
        url,
        { params: queryParams }
      )

      let resourceJson = response.data[this.classNameCamelizedPlural]
      
      if (Array.isArray(resourceJson)) {
        resources = []
        resourceJson.forEach(resource => {
          resources.push(new this(resource))
        })
      } else {
        resources = new this(resourceJson)
      }
    } catch (error) {
      throw new TotalResourceError(error.message, 'total_resource_error')
    }
    return resources
  }

  static async allWithPagination (pagination, filter, options = {}) {
    let url = options.customUrl ? options.customUrl : this.resourceNamePlural
    let sortOrder = pagination.descending ? 'desc' : 'asc'

    let rawResponse

    try {
      rawResponse = await this.axios.get(url, {
        params: {
          page: pagination.page,
          page_size: pagination.rowsPerPage,
          sort_by: pagination.sortBy,
          sort_order: sortOrder,
          filter: filter
        }
      })
    } catch (error) {
      throw new TotalResourceError(error.message, 'total_resource_error')
    }

    let meta = rawResponse.data.meta
    let data = rawResponse.data[this.classNameCamelizedPlural]

    let resources = data.map(resource => {
      return new this(resource)
    })

    let response = {
      meta,
      [this.classNameCamelizedPlural]: resources
    }

    return response
  }

  static async delete (id) {
    try {
      await this.axios.delete(`${this.resourceNamePlural}/${id}`)
    } catch (error) {
      throw new TotalResourceError(error.message, 'total_resource_error')
    }
  }

  static async create (params) {
    try {
      await this.axios.post(`/${this.resourceNamePlural}`, params)
    } catch (error) {
      throw new TotalResourceError(error.message, 'total_resource_error')
    }
  }

  static async update (id, params) {
    try {
      await this.axios.put(`/${this.resourceNamePlural}/${id}`, params)
    } catch (error) {
      throw new TotalResourceError(error.message, 'total_resource_error')
    }
  }

  static get resourceName () {
    return inflection.underscore(this.className)
  }

  static get resourceNamePlural () {
    return inflection.pluralize(this.resourceName)
  }

  static get classNameCamelized () {
    return inflection.camelize(this.className, true)
  }
  
  static get classNameCamelizedPlural () {
    let name = this.className
    name = inflection.camelize(name, true)
    name = inflection.pluralize(name)
    return name
  }
}

export default Base
