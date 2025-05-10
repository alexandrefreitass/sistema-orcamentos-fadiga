import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ClientForm } from "./client-form";
import { Client } from "@/lib/types";
import { Pencil, Trash2, Search, Plus } from "lucide-react";

interface ClientListProps {
  clients: Client[];
  onSave: (client: Omit<Client, "id">) => void;
  onUpdate: (client: Client) => void;
  onDelete: (id: string) => void;
}

export function ClientList({
  clients,
  onSave,
  onUpdate,
  onDelete,
}: ClientListProps) {
  const [openAddForm, setOpenAddForm] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>(
    undefined
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState<Client[]>(clients);

  // Filter clients when search term or clients list changes
  useEffect(() => {
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = clients.filter(client => 
        client.name.toLowerCase().includes(lowercaseSearch) ||
        (client.email && client.email.toLowerCase().includes(lowercaseSearch)) ||
        (client.phone && client.phone.toLowerCase().includes(lowercaseSearch))
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients(clients);
    }
  }, [searchTerm, clients]);

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setOpenEditForm(true);
  };

  const handleDelete = (client: Client) => {
    setSelectedClient(client);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedClient) {
      onDelete(selectedClient.id);
    }
    setOpenDeleteDialog(false);
  };

  const handleUpdate = (data: Omit<Client, "id">) => {
    if (selectedClient) {
      onUpdate({
        ...data,
        id: selectedClient.id,
      });
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Clientes</h1>
        <Button onClick={() => setOpenAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" /> Cadastrar Cliente
        </Button>
      </div>

      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="search"
          placeholder="Buscar clientes por nome, email ou telefone..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  {searchTerm ? "Nenhum cliente encontrado na busca." : "Nenhum cliente cadastrado."}
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.phone || "-"}</TableCell>
                  <TableCell>{client.email || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(client)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(client)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ClientForm
        open={openAddForm}
        onOpenChange={setOpenAddForm}
        onSave={onSave}
      />

      <ClientForm
        open={openEditForm}
        onOpenChange={setOpenEditForm}
        onSave={handleUpdate}
        initialData={selectedClient}
      />

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o cliente{" "}
              <strong>{selectedClient?.name}</strong>? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
