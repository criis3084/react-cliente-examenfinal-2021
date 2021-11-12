import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url="http://localhost:3050/apiumg/public/estudiante/";

class App extends Component {
state={
  data:[],
  modalInsertar: false,
  modalEliminar: false,
  //tipoModal: false,
  form:{
    id: '',
    nombre: '',
    direccion: '',
    telefono: '',
    idcarrera: '',
    idsede: ''
  }
}

peticionGet=()=>{
axios.get(url).then(response=>{
  this.setState({data: response.data});
}).catch(error=>{
  console.log(error.message);
})
}

peticionPost=async()=>{
  delete this.state.form.id;
 await axios.post(url,this.state.form).then(response=>{
    this.modalInsertar();
    this.peticionGet();
  }).catch(error=>{
    console.log(error.message);
  })
}

peticionPut=()=>{
  axios.put(url+this.state.form.id, this.state.form).then(response=>{
    this.modalInsertar();
    this.peticionGet();
  })
}

peticionDelete=()=>{
  axios.delete(url+this.state.form.id).then(response=>{
    this.setState({modalEliminar: false});
    this.peticionGet();
  })
}

modalInsertar=()=>{
  this.setState({modalInsertar: !this.state.modalInsertar});
}

seleccionarEstudiante=(estudiante)=>{
  this.setState({
    tipoModal: 'actualizar',
    form: {
      id: estudiante.idestudiante,
      nombre: estudiante.nombre,
      direccion: estudiante.direccion,
      telefono: estudiante.telefono,
      idcarrera: estudiante.Carrera,
      idsede: estudiante.Sede
      
    }
  })
}

handleChange=async e=>{
e.persist();
await this.setState({
  form:{
    ...this.state.form,
    [e.target.name]: e.target.value
  }
});
console.log(this.state.form);
}

  componentDidMount() {
    this.peticionGet();
  }
  

  render(){
    const {form}=this.state;
  return (
    <div className="App">
    <br /><br /><br />
  <button className="btn btn-success" onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>Agregar Estudiante</button>
  <br /><br />
    <table className="table ">
      <thead>
        <tr>
          
          <th>Nombre</th>
          <th>Dirección</th>
          <th>Telefóno</th>
          <th>ID Carrera</th>
          <th>ID Sede</th>
        </tr>
      </thead>
      <tbody>
        {this.state.data.map(estudiante=>{
          return(
            <tr>
         
          <td>{estudiante.nombre}</td>
          <td>{estudiante.direccion}</td>
          <td>{estudiante.telefono}</td>
          <td>{estudiante.Carrera}</td>
          <td>{estudiante.Sede}</td>
          <td>
                <button className="btn btn-primary" onClick={()=>{this.seleccionarEstudiante(estudiante); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button>
                {"   "}
                <button className="btn btn-danger" onClick={()=>{this.seleccionarEstudiante(estudiante); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
                </td>
          </tr>
          )
        })}
      </tbody>
    </table>



    <Modal isOpen={this.state.modalInsertar}>
                <ModalHeader style={{display: 'block'}}>
                  <span style={{float: 'right'}} onClick={()=>this.modalInsertar()}>x</span>
                </ModalHeader>
                <ModalBody>
                  <div className="form-group">
                   
                    <label htmlFor="nombre">Nombre</label>
                    <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.handleChange} value={form?form.nombre: ''}/>
                    <br />
                    <label htmlFor="nombre">Direccion</label>
                    <input className="form-control" type="text" name="direccion" id="direccion" onChange={this.handleChange} value={form?form.direccion: ''}/>
                    <br />
                    <label htmlFor="telefono">Telefono</label>
                    <input className="form-control" type="text" name="telefono" id="telefono" onChange={this.handleChange} value={form?form.telefono:''}/>
                    <br />
                    <label htmlFor="telefono">ID Carrera *Reingresar el id de carrera</label>
                    <input className="form-control" type="text" name="idcarrera" id="idcarrera" onChange={this.handleChange} value={form?form.idcarrera:''}/>
                    <br />
                    <label htmlFor="idsede">ID Sede *Reingresar el id de sede</label>
                    <input className="form-control" type="text" name="idsede" id="idsede" onChange={this.handleChange} value={form?form.idsede:''}/>
                    </div>
                </ModalBody>

                <ModalFooter>
                  {this.state.tipoModal=='insertar'?
                    <button className="btn btn-success" onClick={()=>this.peticionPost()}>
                    Insertar
                  </button>: <button className="btn btn-primary" onClick={()=>this.peticionPut()}>
                    Actualizar
                  </button>
  }
                    <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar</button>
                </ModalFooter>
          </Modal>


          <Modal isOpen={this.state.modalEliminar}>
            <ModalBody>
               Estás seguro que deseas eliminar al estudiante {form && form.nombre}
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Sí</button>
              <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
            </ModalFooter>
          </Modal>
  </div>



  );
}
}
export default App;
