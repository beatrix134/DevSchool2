import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

import Cabecalho from '../../components/cabecalho'
import Menu from '../../components/menu'

import { Container, Conteudo } from './styled'
import { useState, useEffect, useRef } from 'react';

import LoadingBar from 'react-top-loading-bar'

import Api from '../../service/api';
const api = new Api();

export default function Index() {

    const loading = useRef(null);

    const [alunos, setAlunos] = useState([]);
    const [nome, setNome] = useState('');
    const [chamada, setChamada] = useState('');
    const [turma, setTurma] = useState('');
    const [curso, setCurso] = useState('');
    const [idAlterando, setIdAlterando] = useState(0);

    async function listar() {
        let r = await api.listar();
        setAlunos(r);
    }

    async function inserir() {
        loading.current.continuousStart();

        if(chamada > 0) {
            if (idAlterando == 0) {
                let r = await api.inserir(nome, chamada, curso, turma);
                if (r.erro) 
                    toast.dark(r.erro);
                else 
                    toast.dark('Aluno inserido!');
            } else {
                let r = await api.alterar(idAlterando, nome, chamada, curso, turma);
                if (r.erro) 
                    toast.dark(r.erro);
                else 
                    toast.dark('Aluno alterado!');
            }
        } else (
            toast.dark('Chamada negativa')
        );

        limparCampos();
        listar();
    }

    function limparCampos() {
        setNome('');
        setChamada('');
        setCurso('');
        setTurma('');
        setIdAlterando(0);
    }

    function remover(id) {
        confirmAlert({
            title: 'Remover aluno',
            message: `Tem certeza que deseja remover o aluno ${id} ?`,
            buttons: [
                {
                    label: 'Sim',
                    onClick: async () => {
                        let r = await api.remover(id);
                        if (r.erro)
                            toast.error(`${r.error}`);
                        else {
                            toast.dark('Aluno removido');
                            listar();
                        }
                    }
                },
                {
                    label: 'Não'
                }
            ]
        });
    }

    async function editar(item) {
        setNome(item.nm_aluno);
        setChamada(item.nr_chamada);
        setCurso(item.nm_curso);
        setTurma(item.nm_turma);
        setIdAlterando(item.id_matricula);
    }

    useEffect(() => {
        listar();
    }, [])

    return (
        <Container>
        <ToastContainer />
        <LoadingBar color="purple" ref={loading} />
            <Menu />
            <Conteudo>
                <Cabecalho />
                <div className="body-right-box">
                    <div className="new-student-box">
                        
                        <div className="text-new-student">
                            <div className="bar-new-student"></div>
                            <div className="text-new-student"> {idAlterando == 0 ? "Novo Aluno" : "Alterando Aluno " + idAlterando } </div>
                        </div>

                        <div className="input-new-student"> 
                            <div className="input-left">
                                <div className="agp-input"> 
                                    <div className="name-student"> Nome: </div>  
                                    <div className="input"> <input type="text" value={nome} onChange={e => setNome(e.target.value)} /> </div>  
                                </div> 
                                <div className="agp-input">
                                    <div className="number-student"> Chamada: </div>  
                                    <div className="input"> <input type="text" value={chamada} onChange={e => setChamada(e.target.value)} /> </div> 
                                </div>
                            </div>

                            <div className="input-right">
                                <div className="agp-input">
                                    <div className="corse-student"> Curso: </div>  
                                    <div className="input"> <input type="text" value={curso} onChange={e => setCurso(e.target.value)} /> </div>  
                                </div>
                                <div className="agp-input">
                                    <div className="corse-student"> Turma: </div>  
                                    <div className="input"> <input type="text" value={turma} onChange={e => setTurma(e.target.value)} /> </div> 
                                </div>
                            </div>
                            <div className="button-create"> <button onClick={inserir}> {idAlterando == 0 ? "Cadastrar" : "Alterar"} </button> </div>
                        </div>
                    </div>

                    <div className="student-registered-box">
                        <div className="row-bar"> 
                            <div className="bar-new-student"> </div>
                            <div className="text-registered-student"> Alunos Matriculados </div>
                        </div>
                    
                        <table className ="table-user">
                            <thead>
                                <tr>
                                    <th> ID </th>
                                    <th> Nome </th>
                                    <th> Chamada </th>
                                    <th> Turma </th>
                                    <th> Curso </th>
                                    <th className="coluna-acao"> </th>
                                    <th className="coluna-acao"> </th>
                                </tr>
                            </thead>
                    
                            <tbody>

                                {alunos.map((item, i) => 
                                    <tr className={i % 2 == 0 ? "linha-alternada" : ""}>
                                        <td> {item.id_matricula} </td>
                                        <td title={item.nm_aluno}> 
                                            {item.nm_aluno != null && item.nm_aluno.length >= 25 
                                                ? item.nm_aluno.substr(0, 25) + '...' 
                                                : item.nm_aluno} 
                                        </td>
                                        <td> {item.nr_chamada} </td>
                                        <td> {item.nm_turma} </td>
                                        <td> {item.nm_curso} </td>
                                        <td className="coluna-acao"> <button onClick={() => editar(item)}> <img src="/assets/images/edit.svg" alt="" /> </button> </td>
                                        <td className="coluna-acao"> <button onClick={() => remover(item.id_matricula)}> <img src="/assets/images/trash.svg" alt="" /> </button> </td>
                                    </tr>
                                )}
                                
                            </tbody> 
                        </table>
                    </div>
                </div>
            </Conteudo>
        </Container>
    )
}
