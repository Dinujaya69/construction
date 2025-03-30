"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MainLayout from "@/components/MainLayout/MainLayout";
export default function ClientManagement() {
  const [clients, setClients] = useState([
    {
      id: "C001",
      name: "Suresh",
      idNumber: "12345768",
      contact: "0777232323",
      email: "Sothghg@Gmail.Com",
      project: "Project 1",
    },
    {
      id: "C002",
      name: "Bryan",
      idNumber: "332211128",
      contact: "0742323121",
      email: "Hdcdcucudhdui@Gmail.Com",
      project: "Project 2",
    },
  ]);
  const [newClient, setNewClient] = useState({
    id: "",
    name: "",
    idNumber: "",
    contact: "",
    email: "",
    project: "",
  });
  const [open, setOpen] = useState(false);

  const addClient = () => {
    if (newClient.name.trim()) {
      setClients([
        ...clients,
        { ...newClient, id: `C00${clients.length + 1}` },
      ]);
      setNewClient({
        id: "",
        name: "",
        idNumber: "",
        contact: "",
        email: "",
        project: "",
      });
      setOpen(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center py-4 px-6 bg-gray-100 rounded-t-md">
          <h1 className="text-2xl font-semibold text-gray-700">Clients</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600">
                <Plus className="mr-1 h-4 w-4" /> Add New Customer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {Object.keys(newClient).map(
                  (field, index) =>
                    field !== "id" && (
                      <div key={index} className="grid gap-2">
                        <Label htmlFor={field}>
                          {field.replace(/([A-Z])/g, " $1").trim()}
                        </Label>
                        <Input
                          id={field}
                          value={newClient[field]}
                          onChange={(e) =>
                            setNewClient({
                              ...newClient,
                              [field]: e.target.value,
                            })
                          }
                          placeholder={`Enter ${field}`}
                        />
                      </div>
                    )
                )}
              </div>
              <Button onClick={addClient}>Add Client</Button>
            </DialogContent>
          </Dialog>
        </div>

        <table className="w-full border-collapse border border-gray-200 mt-6">
          <thead>
            <tr className="bg-gray-100">
              {[
                "Client ID",
                "Name",
                "ID Number",
                "Contact No",
                "Email",
                "Project",
              ].map((heading, index) => (
                <th
                  key={index}
                  className="border border-gray-200 px-4 py-2 text-left font-medium"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border border-gray-200">
                <td className="px-4 py-2">{client.id}</td>
                <td className="px-4 py-2">{client.name}</td>
                <td className="px-4 py-2">{client.idNumber}</td>
                <td className="px-4 py-2">{client.contact}</td>
                <td className="px-4 py-2">{client.email}</td>
                <td className="px-4 py-2">{client.project}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}
