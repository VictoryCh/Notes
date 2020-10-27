var csrf_token = $('meta[name="_csrf"]').attr('content');
var notesApi = Vue.resource("/notes{/id}",{headers:{'X-CSRF-TOKEN': this.csrf_token}});

Vue.component('table-row',{
    props: ['note'],
    template: '<tr v-if="note.checked=true">'+
                    '<td><input type="checkbox" checked></td>'+
                    '<td><s>{{ note.text }}</s></td>'+
                    '<td><a @click="editNote"><i style="color: #dc3545" class="fas fa-plus"></i></a></td>'+
                    '<td><a @click="delNote"><i style="color: #dc3545" class="fas fa-times"></i></a></td>'+
               '</tr>'+
               '<tr v-else">'+
                    '<td><input type="checkbox"></td>'+
                    '<td>{{ note.text }}</td>'+
                    '<td><a @click="editNote"><i style="color: #dc3545" class="fas fa-plus"></i></a></td>'+
                    '<td><a @click="delNote><i style="color: #dc3545" class="fas fa-times"></i></a></td>'+
               '</tr>',
    methods: {
        editNote: function(){
            this.$emit("editNote",this.note)
        },
        delNote: function(){
            this.$emit("delNote",this.note)
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
            var note = {text: this.text, checked: this.checked}
            if (this.id != null){
                console.log(this.csrf_token);
                this.$http.put('/notes/'+this.id, {body: JSON.stringify(note)},{headers:{'X-CSRF-TOKEN': csrf_token}}).then(response => response.json().then(data => {
                    this.notes.indexOf(note);
                    this.text='';
                    this.id=null;
                    this.checked=false
                }))
            } else {
                console.log(csrf_token);
                this.$http.post('/notes', {body: note},{headers:{'X-CSRF-TOKEN': csrf_token}}).then(response => response.json().then(data => {
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
                                            '<table-row v-for="note in notesList" :key="note.id" :note="note"/>'+
                                        '</tbody>'+
                                     '</table>'+
                                  '</div>'+
                              '</div>'+
                          '</div>',
    created: function(){
        notesApi.get().then(result => result.json().then(data => {
            data.forEach(item => this.notesList.push(item));
        }))
    },
    methods: {
        editNote: function(note){
            this.note = note;
        },
        delNote: function(note){
            this.notesList.splice(this.notesList.indexOf(note),1)
        }
    }
})

var app = new Vue({
  el: '#main'
})
