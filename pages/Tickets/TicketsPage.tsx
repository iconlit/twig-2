import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Container from '../../components/layout/Container';
import Button from '../../components/ui/Button';
import TicketFormModal from '../../components/tickets/TicketFormModal';
import DeleteConfirmationModal from '../../components/tickets/DeleteConfirmationModal';
import { getTickets, createTicket, updateTicket, deleteTicket as deleteTicketService } from '../../services/ticketService';
import { Ticket, TicketStatus } from '../../types';
import { useToast } from '../../hooks/useToast';
import StatusTag from '../../components/ui/StatusTag';

// --- Helper Functions ---
const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

const formatAbsoluteDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
};

const TicketsPage: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const { addToast } = useToast();

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getTickets();
            const sortedData = data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
            setTickets(sortedData);
        } catch (error) {
            addToast('Failed to load tickets.', 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const filteredTickets = useMemo(() => {
        return tickets
            .filter(ticket =>
                ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ticket.description?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter(ticket =>
                statusFilter === 'all' || ticket.status === statusFilter
            );
    }, [tickets, searchTerm, statusFilter]);

    const handleCreate = () => {
        setSelectedTicket(null);
        setIsFormModalOpen(true);
    };

    const handleEdit = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setIsFormModalOpen(true);
    };

    const handleDelete = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setIsDeleteModalOpen(true);
    };

    const handleFormSubmit = async (formData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            if (selectedTicket) {
                await updateTicket(selectedTicket.id, formData);
                addToast('Ticket updated successfully!', 'success');
            } else {
                await createTicket(formData);
                addToast('Ticket created successfully!', 'success');
            }
            setIsFormModalOpen(false);
            fetchTickets();
        } catch (error) {
            addToast(`Failed to ${selectedTicket ? 'update' : 'create'} ticket.`, 'error');
        }
    };
    
    const handleDeleteConfirm = async () => {
        if (!selectedTicket) return;
        try {
            await deleteTicketService(selectedTicket.id);
            addToast('Ticket deleted successfully!', 'success');
            setIsDeleteModalOpen(false);
            fetchTickets();
        } catch (error) {
            addToast('Failed to delete ticket.', 'error');
        }
    };

    const statusOptions = [
      { value: 'all', label: 'All Statuses' },
      { value: TicketStatus.Open, label: 'Open' },
      { value: TicketStatus.InProgress, label: 'In Progress' },
      { value: TicketStatus.Closed, label: 'Closed' },
    ];

    const TableEmptyState = () => (
        <tr>
            <td colSpan={5} className="text-center py-16">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    {tickets.length > 0 ? 'No matching tickets' : 'No tickets yet'}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {tickets.length > 0 ? 'Try adjusting your search or filter.' : 'Get started by creating a new ticket.'}
                </p>
                {tickets.length === 0 && (
                    <div className="mt-6">
                        <Button onClick={handleCreate}>
                            Create Ticket
                        </Button>
                    </div>
                )}
            </td>
        </tr>
    );

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            <main className="flex-grow">
                <Container className="py-8">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ticket Management</h1>
                        <div className="flex items-center gap-2">
                             <div className="relative flex-grow">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search tickets..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                            >
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                            <Button onClick={handleCreate} className="hidden sm:inline-flex">Create Ticket</Button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Updated</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {loading ? (
                                        <tr><td colSpan={5} className="text-center py-10">Loading tickets...</td></tr>
                                    ) : filteredTickets.length > 0 ? (
                                        filteredTickets.map(ticket => (
                                            <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{ticket.title}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{ticket.description}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <StatusTag status={ticket.status} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {formatRelativeTime(ticket.updatedAt)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {formatAbsoluteDate(ticket.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                                    <button onClick={() => handleEdit(ticket)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">Edit</button>
                                                    <button onClick={() => handleDelete(ticket)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <TableEmptyState />
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Container>
            </main>
            <Footer />

            <TicketFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleFormSubmit}
                ticket={selectedTicket}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                ticketTitle={selectedTicket?.title || ''}
            />
        </div>
    );
};

export default TicketsPage;