import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Search, Mail, Phone, Calendar, Trash2 } from "lucide-react";

type Message = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  sector: string;
  message: string;
  createdAt: string;
};

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/contact-messages")
      .then(res => res.json())
      .then(data => {
        setMessages(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        setError("Erreur lors du chargement des messages : " + err.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (messageId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) return;
    
    try {
      const response = await fetch(`/api/contact-messages/${messageId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setMessages(prev => prev.filter(m => m.id !== messageId));
      } else {
        alert("Erreur lors de la suppression du message");
      }
    } catch (error) {
      alert("Erreur de réseau lors de la suppression");
    }
  };

  const filteredMessages = messages.filter(message =>
    `${message.firstName} ${message.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Chargement des messages...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Messages reçus via le formulaire de contact</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, email ou contenu du message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messages.length}</div>
              <p className="text-xs text-muted-foreground">
                Messages reçus
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cette semaine</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {messages.filter(m => {
                  const messageDate = new Date(m.createdAt);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return messageDate > weekAgo;
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Nouveaux messages
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aujourd'hui</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {messages.filter(m => {
                  const messageDate = new Date(m.createdAt);
                  const today = new Date();
                  return messageDate.toDateString() === today.toDateString();
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Messages du jour
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Messages List */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des messages ({filteredMessages.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredMessages.length > 0 ? (
              <div className="space-y-4">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className="border rounded-lg p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{message.firstName} {message.lastName}</h3>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="w-fit">
                              {message.sector}
                            </Badge>
                            <Badge variant="outline" className="w-fit">
                              {formatDate(message.createdAt)}
                            </Badge>
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <a href={`mailto:${message.email}`} className="hover:text-blue-600">
                              {message.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="px-2 py-1 bg-gray-100 rounded text-xs">
                              Secteur: {message.sector}
                            </div>
                          </div>
                        </div>

                        {/* Message Content */}
                        <div className="bg-gray-50 rounded-md p-4">
                          <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`mailto:${message.email}`, '_blank')}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(message.id)}
                          className="text-red-600 hover:text-red-700"
                          data-testid={`button-delete-${message.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun message trouvé</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? "Aucun message ne correspond à votre recherche." : "Aucun message reçu pour le moment."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}