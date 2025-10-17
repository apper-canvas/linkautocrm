import { useState } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import contactService from "@/services/api/contactService";

const ContactForm = ({ 
  isOpen, 
  onClose, 
  contact = null, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    name: contact?.name || "",
    company: contact?.company || "",
    email: contact?.email || "",
    phone: contact?.phone || "",
    lastContactDate: contact?.lastContactDate || ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (contact) {
        await contactService.update(contact.Id, formData);
        toast.success("Contact updated successfully");
      } else {
        await contactService.create(formData);
        toast.success("Contact created successfully");
      }
      
      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        lastContactDate: ""
      });
    } catch (error) {
      toast.error(`Failed to ${contact ? "update" : "create"} contact`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={contact ? "Edit Contact" : "Add New Contact"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Name *"
          value={formData.name}
          onChange={handleChange("name")}
          error={errors.name}
          placeholder="Enter contact name"
        />
        
        <FormField
          label="Company"
          value={formData.company}
          onChange={handleChange("company")}
          placeholder="Enter company name"
        />
        
        <FormField
          label="Email"
          type="input"
          value={formData.email}
          onChange={handleChange("email")}
          error={errors.email}
          placeholder="Enter email address"
        />
        
        <FormField
          label="Phone"
          value={formData.phone}
          onChange={handleChange("phone")}
          placeholder="Enter phone number"
        />
        
        <FormField
          label="Last Contact Date"
          type="input"
          inputType="date"
          value={formData.lastContactDate}
          onChange={handleChange("lastContactDate")}
        />
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
          >
            {contact ? "Update Contact" : "Create Contact"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ContactForm;