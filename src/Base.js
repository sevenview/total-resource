import inflection from 'inflection'

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
    await this.axios
      .get(`/${this.resourceNamePlural}/${id}`)
      .then(response => {
        resource = new this(response.data[this.resourceName])
      })
    return resource
  }

  static async all () {
    let resources = []
    await this.axios
      .get(`/${this.resourceNamePlural}`)
      .then(response => {
        response.data[this.classNameCamelizedPlural].forEach(item => {
          resources.push(new this(item))
        })
      })
    return resources
  }

  static get resourceName () {
    return inflection.underscore(this.className)
  }

  static get resourceNamePlural () {
    return inflection.pluralize(this.resourceName)
  }
  
  static get classNameCamelizedPlural () {
    let name = this.className
    name = inflection.camelize(name, true)
    name = inflection.pluralize(name)
    console.log('FF: ', name)
    return name
  }
}

export default Base
