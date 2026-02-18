import { Suspense, useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { NAVIGATION_PATH } from "@/constants";
import DataTable from "@/components/DataTable";
import { Link, useNavigate } from "react-router-dom";
import Loader from "@/components/Loader";
import { TextFormFieldType } from "@/components/form/TextFormField/TextFormFieldType";
import CustomModal from "@/components/CustomModal";
import UserForm from "./UserForm";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { User } from "@/types/api/User";
import { UserProfile } from "@/types/api/enums/UserProfile";
import UserService from "@/services/UserService";
import ImportUser from "./UserImport";
import { useDialog } from "@/contexts/DialogContext";

const UserListing = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [date, setDate] = useState<Date>();
    const [showModal, setModal] = useState<({show:boolean, data:User|undefined})>({show:false, data:undefined});
    const [showImportModal, setImportModal] = useState<boolean>(false);
    const { showDialog } = useDialog();

    useEffect(() => {
        setDate(new Date());
    }, []);

    function handleActionClick(client:User){
        setModal({show:true, data:client});
    }

    async function closeModal(){
        setModal({show:false, data:undefined});
        await queryClient.invalidateQueries({  queryKey: [["user", "listing", date]], exact: false});
    }

    return <>
        <Row style={{ justifyContent: "end", margin: "10px 0" }}>
            <Link to={NAVIGATION_PATH.USERS.CREATE.ABSOLUTE}>
                <Button style={{ maxWidth: "fit-content", float: "right" }}>Adicionar</Button>
            </Link>
        </Row>
        <Row style={{ justifyContent: "end", margin: "10px 0" }}>
            <Button style={{ maxWidth: "fit-content", float: "right", marginRight: '13px', minWidth: '87.45px' }} variant="secondary" onClick={()=> setImportModal(true)}>Importar</Button>
        </Row>
        <CustomModal onHide={()=>setModal({show:false, data:undefined})} show={showModal.show} children={UserForm({dataUser: showModal.data, onClose:()=>{closeModal()}})}  header={{title:'Atualizar', closeButton:true}}></CustomModal>
        <CustomModal onHide={()=>setImportModal(false)} show={showImportModal} children={ImportUser({onClose:()=>{setImportModal(false)}})} header={{title:'Importar Arquivo', closeButton:true}}></CustomModal>
        <Card >
            <Card.Title></Card.Title>
            <Card.Header>
                <Card.Title>
                    Usuários
                </Card.Title>
            </Card.Header>
            <Suspense fallback={<><Loader /><br /><br /></>}>
                <DataTable<User, any>
                    thin
                    columns={[
                        
                        { Header: "Nome de Usuário", accessor: "username" },
                        { Header: "Perfil", accessor: "profile", Cell: ({ value }: { value: string | UserProfile }) => {
                                    if (!value) return "";
                                    if(value=='Administrator')
                                        return 'Administrador';
                                    else    
                                        return 'Operador';
                        }},
                        { Header: "Data de Criação", accessor: "createdAt", Cell: ({ value }: { value: Date |string|undefined }) => {
                                    if (!value) return "";
                                    const date = new Date(value);
                                    return moment(date).format('DD/MM/YYYY');
                        }},
                        {
                            Header: "Ações",
                            id: "actions",
                            Cell: ({ row }: { row: { original: User} }) => (
                            <div className="d-flex justify-content-center align-items-center gap-2"  style={{ flexWrap:'wrap'}}>
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm"
                                        onClick={() => handleActionClick(row.original)}
                                    >
                                    Editar
                                    </Button>
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm"
                                        onClick={() => {
                                            showDialog({
                                                title: "Confirmar Exclusão",
                                                message: `Tem certeza que deseja excluir o usuário ${row.original.username}?`,
                                                actions: [
                                                            {   
                                                                label: "Cancelar",
                                                                color: "inherit",
                                                                onClick: () =>{},
                                                            },
                                                            {
                                                                label: "Excluir",
                                                                color: "primary",
                                                                onClick: async () => {
                                                                    await UserService.deleteUser(row.original.id!);
                                                                    await queryClient.invalidateQueries({  queryKey: [["user", "listing", date]],exact: false});
                                                            }
                                                            }
                                                        ]
                                                });}}
                                        >
                                        Excluir
                                        </Button>
                                </div>
                            ),
                        },
                    ]}
                    query={async (filters) => {
                       if(!filters.find(x=>x.name=='userName' && x.value))
                            return await UserService.getAll();
                        else
                            return await UserService.getbyName(filters.find(x=>x.name=='userName' && x.value)!.value as string);
                    }}
                    fetchButton
                    cleanButton
                    filters={[{
                        componentType: TextFormFieldType.INPUT,
                        name: "userName",
                        label: "Filtrar",
                        placeholder: "Digite o nome",
                        col: 10
                    }]}
                    queryName={["user", "listing", date]}
                />
            </Suspense>
        </Card >
    </>
}

export default UserListing;