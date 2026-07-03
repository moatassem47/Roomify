import React, { useState, useEffect } from 'react';
import api from '../../../utils/axios';
import toast from 'react-hot-toast';
import { Plus, Users, Truck } from 'lucide-react';
import DeliveryPersonnelTable from '../components/Delivery/DeliveryPersonnelTable';
import DeliveryPersonnelModal from '../components/Delivery/DeliveryPersonnelModal';
import DeliveryHistoryModal from '../components/Delivery/DeliveryHistoryModal';
import ActiveDeliveries from '../components/Delivery/ActiveDeliveries';

const Delivery = () => {
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personnel'); // 'personnel' | 'deliveries'
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [personnelToEdit, setPersonnelToEdit] = useState(null);
  
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyPersonnel, setHistoryPersonnel] = useState(null);

  const fetchPersonnel = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/delivery');
      setPersonnel(res.data.data || []);
    } catch (err) {
      if(err.response?.status !== 404) {
        toast.error('Failed to fetch delivery personnel');
        console.error(err);
      } else {
        setPersonnel([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonnel();
  }, []);

  const handleOpenModal = (person = null) => {
    setPersonnelToEdit(person);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPersonnelToEdit(null);
  };

  const handleSubmitModal = async (data) => {
    try {
      if (personnelToEdit) {
        await api.patch(`/admin/delivery/update/${personnelToEdit._id}`, data);
        toast.success('Delivery person updated successfully');
      } else {
        await api.post('/admin/delivery/add', data);
        toast.success('Delivery person added successfully');
      }
      handleCloseModal();
      fetchPersonnel();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
      console.error(err);
    }
  };

  const handleToggleStatus = async (id, isActive) => {
    try {
      await api.patch(`/admin/delivery/status/${id}`, { isActive });
      toast.success(`Account ${isActive ? 'activated' : 'deactivated'}`);
      fetchPersonnel();
    } catch (err) {
      toast.error('Failed to update status');
      console.error(err);
    }
  };

  const handleViewHistory = (person) => {
    setHistoryPersonnel(person);
    setHistoryModalOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-cedar">Delivery Management</h1>
          <p className="text-brand-cedar/70 mt-1">Manage personnel, assign orders, and track deliveries.</p>
        </div>
        {activeTab === 'personnel' && (
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center px-4 py-2 bg-brand-cedar text-[#FBF9F6] rounded hover:bg-opacity-90 transition-colors shadow-sm cursor-pointer"
          >
            <Plus size={20} className="mr-2" />
            Add Personnel
          </button>
        )}
      </div>

      <div className="flex space-x-1 border-b border-brand-cedar/20">
        <button
          onClick={() => setActiveTab('personnel')}
          className={`flex items-center px-4 py-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'personnel' 
              ? 'border-brand-cedar text-brand-cedar font-semibold' 
              : 'border-transparent text-brand-cedar/60 hover:text-brand-cedar/80 hover:border-brand-cedar/40'
          }`}
        >
          <Users size={18} className="mr-2" />
          Personnel Management
        </button>
        <button
          onClick={() => setActiveTab('deliveries')}
          className={`flex items-center px-4 py-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'deliveries' 
              ? 'border-brand-cedar text-brand-cedar font-semibold' 
              : 'border-transparent text-brand-cedar/60 hover:text-brand-cedar/80 hover:border-brand-cedar/40'
          }`}
        >
          <Truck size={18} className="mr-2" />
          Deliveries Dashboard
        </button>
      </div>

      {loading && activeTab === 'personnel' ? (
        <div className="p-12 text-center text-brand-cedar">Loading personnel data...</div>
      ) : activeTab === 'personnel' ? (
        <DeliveryPersonnelTable
          personnel={personnel}
          onEdit={handleOpenModal}
          onToggleStatus={handleToggleStatus}
          onViewHistory={handleViewHistory}
        />
      ) : (
        <ActiveDeliveries personnel={personnel} />
      )}

      <DeliveryPersonnelModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitModal}
        personnelToEdit={personnelToEdit}
      />

      <DeliveryHistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        personnel={historyPersonnel}
      />
    </div>
  );
};

export default Delivery;