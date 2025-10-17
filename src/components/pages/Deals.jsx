import { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import DealTable from "@/components/organisms/DealTable";
import DealForm from "@/components/organisms/DealForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import dealService from "@/services/api/dealService";
import contactService from "@/services/api/contactService";

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editDeal, setEditDeal] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      setError("Failed to load deals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddDeal = () => {
    setEditDeal(null);
    setShowForm(true);
  };

  const handleEditDeal = (deal) => {
    setEditDeal(deal);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditDeal(null);
  };

  const handleFormSuccess = () => {
    loadData();
  };

  if (loading) {
    return (
      <div>
        <Header 
          title="Deals"
          action={true}
          actionLabel="Add Deal"
          onAction={handleAddDeal}
        />
        <div className="p-6">
          <Loading variant="table" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header 
          title="Deals"
          action={true}
          actionLabel="Add Deal"
          onAction={handleAddDeal}
        />
        <div className="p-6">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header 
        title="Deals"
        action={true}
        actionLabel="Add Deal"
        onAction={handleAddDeal}
      />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {deals.length === 0 ? (
            <Empty
              message="No deals yet"
              description="Create your first deal to start tracking your sales pipeline"
              actionLabel="Add Deal"
              onAction={handleAddDeal}
              icon="DollarSign"
            />
          ) : (
            <DealTable
              deals={deals}
              contacts={contacts}
              onEdit={handleEditDeal}
              onRefresh={loadData}
            />
          )}
        </div>
      </div>

      <DealForm
        isOpen={showForm}
        onClose={handleFormClose}
        deal={editDeal}
        contacts={contacts}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default Deals;