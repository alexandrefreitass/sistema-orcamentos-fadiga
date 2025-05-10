import { useState, useEffect } from "react";
import { ClientList } from "@/components/clients/client-list";
import { Client } from "@/lib/types";
import { getClients, saveClient, updateClient, deleteClient } from "@/lib/data";

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    // Load clients on mount
    const loadedClients = getClients();
    setClients(loadedClients);
  }, []);

  const handleSave = (client: Omit<Client, "id">) => {
    const newClient = saveClient(client);
    setClients([...clients, newClient]);
    return newClient;
  };

  const handleUpdate = (client: Client) => {
    updateClient(client);
    setClients(clients.map(c => c.id === client.id ? client : c));
    return client;
  };

  const handleDelete = (id: string) => {
    deleteClient(id);
    setClients(clients.filter(c => c.id !== id));
  };

  return (
    <ClientList
      clients={clients}
      onSave={handleSave}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}
