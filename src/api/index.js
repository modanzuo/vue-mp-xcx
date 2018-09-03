import Vue from 'vue'

export class Api extends Vue {
  getUserMsg (data) {
    let url = `basUser/getUserMsg`
    return this.$ajax(url, data)
  }

  findEnterList (data) {
    let url = `basUser/getUserMsg`
    return this.$ajax(url, data)
  }

  updateTaskStatus (data) {
    let url = `sysTaskList/updateTaskStatus`
    return this.$ajax(url, data)
  }

  findById (data) {
    let url = `basEnterList/findById`
    return this.$ajax(url, data)
  }

  craeteMeTask (data) {
    let url = `sysTaskList/craeteMeTask`
    return this.$ajax(url, data)
  }

  seachCompany (data) {
    let url = `basEnterList/seachCompany`
    return this.$ajax(url, data)
  }

  taskLishi (data) {
    let url = `sysTaskList/taskLishi`
    return this.$ajax(url, data)
  }

  editShangBao (data) {
    let url = `sysTaskList/editShangBao`
    return this.$ajax(url, data)
  }

  taskList (data) {
    let url = `sysTaskList/taskList`
    return this.$ajax(url, data)
  }

  docMsg (data) {
    let url = `sysTaskList/docMsg`
    return this.$ajax(url, data)
  }

  createTask (data) {
    let url = `sysTaskList/createTask`
    return this.$ajax(url, data)
  }
}

export default new Api()
