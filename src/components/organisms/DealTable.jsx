import React, { useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import dealService from "@/services/api/dealService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ConfirmDialog from "@/components/molecules/ConfirmDialog";

const DealTable = ({ deals, contacts, onEdit, onRefresh }) => {
  const [deleteDeal, setDeleteDeal] = useState(null);
  const [loading, setLoading] = useState(false);

const getContactName = (contactIdObj) => {
    if (contactIdObj && typeof contactIdObj === 'object' && contactIdObj.Name) {
      return contactIdObj.Name;
    }
    const contact = contacts.find(c => c.Id === contactIdObj);
    return contact?.name_c || "Unknown Contact";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleDelete = async () => {
    if (!deleteDeal) return;
    
    setLoading(true);
    try {
await dealService.delete(deleteDeal.Id);
      toast.success("Deal deleted successfully");
      onRefresh();
    } catch (error) {
      toast.error("Failed to delete deal");
    } finally {
      setLoading(false);
      setDeleteDeal(null);
    }
  };

  const statusColors = {
    lead: "lead",
    negotiation: "negotiation", 
    won: "won",
    lost: "lost"
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deal Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deals.map((deal) => (
<tr key={deal.Id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <span className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                          <ApperIcon name="DollarSign" size={18} />
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {deal.name_c}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getContactName(deal.contact_id_c)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(deal.value_c)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={statusColors[deal.status_c]}>
                      {deal.status_c?.charAt(0).toUpperCase() + deal.status_c?.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {deal.ModifiedOn ? 
                      format(new Date(deal.ModifiedOn), "MMM d, yyyy") : 
                      "-"
                    }
                  </td>
<td className="px-6 py-4 text-sm text-gray-500">
                    {deal.notes_c ? (
                      deal.notes_c.length > 50 ? (
                        <span title={deal.notes_c}>
                          {deal.notes_c.substring(0, 50)}...
                        </span>
                      ) : (
                        deal.notes_c
                      )
                    ) : (
                      <span className="text-gray-400 italic">No notes</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(deal)}
                      >
                        <ApperIcon name="Edit" className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteDeal(deal)}
                        className="text-error-600 hover:text-error-700"
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteDeal}
        onClose={() => setDeleteDeal(null)}
        onConfirm={handleDelete}
        title="Delete Deal"
message={`Are you sure you want to delete the deal "${deleteDeal?.name_c}"? This action cannot be undone.`}
        confirmLabel={loading ? "Deleting..." : "Delete"}
        variant="danger"
      />
    </>
  );
};

export default DealTable;