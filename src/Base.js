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
        response.data[this.resourceNamePlural].forEach(item => {
          resources.push(new this(item))
        })
      })
    return resources
  }

  static get resourceName () {
    return this.className.toLowerCase()
  }
  static get resourceNamePlural () {
    return inflection.pluralize(this.resourceName)
  }
}

export default Base
