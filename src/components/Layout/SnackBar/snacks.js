import Vue from "vue"

export default {
    savedSnack (message) {
        this.snack = true
        this.snackColor = 'success'
        this.snackText = message ? message : 'Data saved'
    },
    canceledSnack () {
        this.snack = true
        this.snackColor = 'info'
        this.snackText = 'Canceled'
    },
    violationSnack () {
        this.snack = true
        this.snackColor = 'error'
        this.snackText = 'The form contains errors'
    },
    deletedSnack(message) {
        this.snack = true
        this.snackColor = 'success'
        this.snackText = message ? message : 'Data deleted'
    }
}