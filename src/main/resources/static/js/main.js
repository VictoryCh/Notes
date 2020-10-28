var csrf_token = $('meta[name="_csrf"]').attr('content');

Vue.component('table-row',{
    props: ['note'],
    data: function(){
        return {
            flag: this.note.checked
        }
    },
    template: '<tr v-if="flag==true">'+
                    '<td><input type="checkbox" v-model="flag" @click="checkNote"></td>'+
                    '<td><s>{{ note.text }}</s></td>'+
                    '<td class="d-flex justify-content-end">'+
                        '<button @click="editNote" class="btn"><i style="color: #007bff" class="fas fa-pen"></i></button>'+
                        '<button @click="delNote" class="btn"><i style="color: #dc3545" class="fas fa-times"></i></button>'+
                    '</td>'+
               '</tr>'+
               '<tr v-else>'+
                    '<td><input type="checkbox" v-model="flag" @click="checkNote"></td>'+
                    '<td>{{ note.text }}</td>'+
                    '<td class="d-flex justify-content-end">'+
                        '<button @click="editNote" class="btn"><i style="color: #007bff" class="fas fa-pen"></i></button>'+
                        '<button @click="delNote" class="btn"><i style="color: #dc3545" class="fas fa-times"></i></button>'+
                    '</td>'+
               '</tr>',
    methods: {
        editNote: function(){
            this.$emit("editNote",this.note)
        },
        delNote: function(){
            this.$emit("delNote",this.note)
        },
        checkNote: function(){
            this.note.checked = !this.flag
            this.$http.put('/notes/'+this.note.id, this.note, {headers:{'X-CSRF-TOKEN': csrf_token}});
        }
    }
})

Vue.component('form-edit',{
    props: ['notes','noteAttr'],
    data: function(){
        return {
            text: '',
            id: null,
            checked: false
        }
    },
    watch: {
        noteAttr: function(newVal,oldVal){
            this.text = newVal.text;
            this.id = newVal.id;
            this.checked = newVal.checked;
        }
    },
    template: '<div class="col input-group m-1">'+
                    '<input type="text" class="form-control" placeholder="input text or click row" v-model="text">'+
                    '<div class="input-group-append">'+
                        '<button class="btn btn-primary" @click="saveNote">Сохранить</button>'+
                    '</div>'+
               '</div>',
    methods: {
        saveNote: function(){
            var note = { text: this.text, checked: this.checked }
            if (this.id != null){
                this.$http.put('/notes/'+this.id, note, {headers:{'X-CSRF-TOKEN': csrf_token}}).then(response => response.json().then(data => {
                    let nt = this.notes.find(el => el.id === this.id)
                    this.notes.splice(this.notes.indexOf(nt),1,data);
                    this.text='';
                    this.id=null;
                    this.checked=false
                }))
            } else {
                this.$http.post('/notes', note ,{
                        headers:{'X-CSRF-TOKEN': csrf_token}
                } ).then(response => response.json().then(data => {
                    this.notes.push(data);
                    this.text='';
                    this.id=null;
                    this.checked=false
                }))
            }
        }
    }
})

Vue.component('main-form',{
    data: function(){
        return {
            notesList: [],
            note: null
        }
    },
    template: '<div class="col-8 border rounded m-2 p-2" >'+
                              '<div class="row">'+
                                    '<form-edit :notes="notesList" :noteAttr="note"/>'+
                              '</div>'+
                              '<div class="row">'+
                                  '<div class="col">'+
                                     '<table class="table table-sm">'+
                                        '<tbody>'+
                                            '<table-row v-for="note in notesList" :key="note.id" :note="note" v-on:editNote="editNote" v-on:delNote="delNote"/>'+
                                        '</tbody>'+
                                     '</table>'+
                                  '</div>'+
                              '</div>'+
                          '</div>',
    created: function(){
        this.$http.get('/notes').then(result => result.json().then(data => {
            data.forEach(item => this.notesList.push(item));
        }))
    },
    methods: {
        editNote: function(note){
            this.note = note;
        },
        delNote: function(note){
            this.$http.delete('/notes/'+note.id,{headers:{'X-CSRF-TOKEN': csrf_token}}).then(result => {
                if (result.ok){
                    this.notesList.splice(this.notesList.indexOf(note),1)
                }
            })
        }
    }
})

var app = new Vue({
  el: '#main'
})
