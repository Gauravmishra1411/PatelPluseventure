
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Filter,
  MoreHorizontal,
  UserPlus,
  Mail,
  Phone,
  Eye,
  Edit,
  Trash2,
  X,
  Briefcase,
  User,
  Building,
  MessageSquare,
  TrendingUp,
  Plus,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, query, orderBy, Timestamp, doc, deleteDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Client {
  id: string
  fullName: string
  email: string
  phone?: string
  companyName?: string
  projectTitle?: string
  status: "New" | "Contacted" | "In Progress" | "Completed"
  createdAt: Timestamp
  [key: string]: any
}

interface Milestone {
  text: string
  completed: boolean
}

function ProgressUpdateModal({ client, isOpen, onClose }: { client: Client; isOpen: boolean; onClose: () => void }) {
  const [status, setStatus] = useState(client.projectStatus || 'Planning');
  const [milestones, setMilestones] = useState<Milestone[]>(client.milestones || [{ text: '', completed: false }]);
  const [completionDate, setCompletionDate] = useState(client.completionDate || '');
  const [newMilestone, setNewMilestone] = useState('');

  useEffect(() => {
    setStatus(client.projectStatus || 'Planning');
    setMilestones(client.milestones || [{ text: '', completed: false }]);
    setCompletionDate(client.completionDate || '');
  }, [client]);

  const handleAddMilestone = () => {
    if (newMilestone.trim() !== '') {
      setMilestones([...milestones, { text: newMilestone, completed: false }]);
      setNewMilestone('');
    }
  };

  const handleToggleMilestone = (index: number) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[index].completed = !updatedMilestones[index].completed;
    setMilestones(updatedMilestones);
  };

  const handleRemoveMilestone = (index: number) => {
    const updatedMilestones = milestones.filter((_, i) => i !== index);
    setMilestones(updatedMilestones);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const clientRef = doc(db, "clients", client.id);
      const progressData = {
        projectStatus: status,
        milestones: milestones.filter(m => m.text.trim() !== ''),
        completionDate,
        progressHistory: arrayUnion({
          status,
          date: new Date().toISOString(),
          message: `Project status updated to ${status}.`
        })
      };
      await updateDoc(clientRef, progressData);
      toast.success("Project progress updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Failed to update progress.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle>Update Progress for {client.projectTitle}</DialogTitle>
          <DialogDescription className="text-muted-foreground">Set the current status, milestones, and completion date.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Project Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="bg-secondary/20 border-border"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="Planning">Planning</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Testing">Testing</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Estimated Completion Date</Label>
            <Input type="date" value={completionDate} onChange={e => setCompletionDate(e.target.value)} className="bg-secondary/20 border-border" />
          </div>
          <div className="space-y-2">
            <Label>Milestones</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Checkbox id={`milestone-${index}`} checked={milestone.completed} onCheckedChange={() => handleToggleMilestone(index)} />
                  <Input value={milestone.text} onChange={e => {
                    const updated = [...milestones];
                    updated[index].text = e.target.value;
                    setMilestones(updated);
                  }} className="bg-secondary/20 border-border" />
                  <Button type="button" size="icon" variant="destructive" onClick={() => handleRemoveMilestone(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={newMilestone} onChange={e => setNewMilestone(e.target.value)} placeholder="Add new milestone" className="bg-secondary/20 border-border" />
              <Button type="button" onClick={handleAddMilestone}><Plus className="w-4 h-4" /></Button>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save Progress</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}


export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const router = useRouter()

  useEffect(() => {
    const q = query(collection(db, "clients"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const clientsData: Client[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          clientsData.push({
            id: doc.id,
            status: data.status || "New",
            ...data,
          } as Client)
        })
        setClients(clientsData)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching clients:", error)
        toast.error("Failed to load clients.")
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const handleOpenProgressModal = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  }

  const handleDeleteClient = async (clientId: string) => {
    if (window.confirm("Are you sure you want to delete this client record? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "clients", clientId))
        toast.success("Client record deleted successfully.")
      } catch (error) {
        console.error("Error deleting client:", error)
        toast.error("Failed to delete client record.")
      }
    }
  }

  const handleChat = (client: Client) => {
    router.push(`/admin/messages/chat?userId=${client.id}&userName=${encodeURIComponent(client.fullName)}`);
  };

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "new": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "contacted": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "in progress": return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "completed": return "bg-green-500/20 text-green-400 border-green-500/30"
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8">
      {/* Search and Filter */}
      <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Card className="bg-card/50 border-primary/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Briefcase className="w-6 h-6 text-primary" /> Client Management</CardTitle>
            <CardDescription>View, manage, and track all your client projects and onboarding data.</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search clients by name, email, or project..." className="pl-10 bg-background/50 border-primary/20 text-foreground placeholder-muted-foreground" />
              </div>
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent">
                <Filter className="w-4 h-4 mr-2" /> Filter
              </Button>
              <Button onClick={() => router.push("/admin/add/client")} className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Client
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Clients Grid */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        {clients.map((client, index) => (
          <motion.div key={client.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
            <Card className="bg-card/50 border-primary/20 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 flex flex-col h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="text-xl font-bold bg-gradient-to-r from-primary to-accent text-primary-foreground">{client.fullName.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{client.fullName}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">{client.companyName || 'N/A'}</CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-popover border-primary/20">
                      <DropdownMenuItem className="text-foreground hover:bg-primary/10" onClick={() => router.push(`/admin/clients/${client.id}`)}><Eye className="w-4 h-4 mr-2" />View Details</DropdownMenuItem>
                      <DropdownMenuItem className="text-foreground hover:bg-primary/10" onClick={() => handleOpenProgressModal(client)}><TrendingUp className="w-4 h-4 mr-2" />Update Progress</DropdownMenuItem>
                      <DropdownMenuItem className="text-foreground hover:bg-primary/10"><Edit className="w-4 h-4 mr-2" />Edit Client</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClient(client.id)} className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"><Trash2 className="w-4 h-4 mr-2" />Delete Client</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow flex flex-col justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">{client.projectTitle || "No project title"}</div>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant={"outline"} className={getStatusVariant(client.status)}>{client.status}</Badge>
                    <span className="text-xs text-muted-foreground">
                      Added: {client.createdAt?.toDate().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="space-y-2 pt-2 mt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="w-4 h-4" /><span className="truncate">{client.email}</span></div>
                    {client.phone && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="w-4 h-4" /><span>{client.phone}</span></div>}
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleChat(client)}>
                    <MessageSquare className="w-4 h-4 mr-2" /> Chat
                  </Button>
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground" onClick={() => router.push(`/admin/clients/${client.id}`)}>
                    <Eye className="w-4 h-4 mr-2" /> View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      {selectedClient && (
        <ProgressUpdateModal
          client={selectedClient}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedClient(null);
          }}
        />
      )}
    </div>
  )
}

