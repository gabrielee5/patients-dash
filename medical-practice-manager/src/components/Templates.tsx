import React, { useEffect, useState } from 'react';
import { FileText, Plus, Edit, Trash2 } from 'lucide-react';
import { Button, Card, CardHeader, CardContent, Modal, Input, TextArea } from './ui';
import type { VisitTemplate } from '../types';
import { templateService } from '../services/templateService';

export const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<VisitTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<VisitTemplate | undefined>();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await templateService.getAllTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      await templateService.deleteTemplate(id);
      loadTemplates();
    }
  };

  const handleEdit = (template: VisitTemplate) => {
    setEditingTemplate(template);
    setModalOpen(true);
  };

  const handleNew = () => {
    setEditingTemplate(undefined);
    setModalOpen(true);
  };

  const handleSaved = () => {
    setModalOpen(false);
    setEditingTemplate(undefined);
    loadTemplates();
  };

  const getCategoryColor = (category: VisitTemplate['category']) => {
    const colors = {
      general: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
      'follow-up': 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
      urgent: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
      specialist: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
      custom: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    };
    return colors[category];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Visit Templates
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Pre-configured templates for common appointment types
          </p>
        </div>
        <Button onClick={handleNew} variant="primary">
          <Plus size={20} className="mr-2" />
          New Template
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
            Loading templates...
          </div>
        ) : templates.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FileText className="mx-auto text-gray-400 dark:text-gray-600 mb-2" size={48} />
            <p className="text-gray-500 dark:text-gray-400">No templates yet</p>
          </div>
        ) : (
          templates.map((template) => (
            <Card key={template.id} hoverable>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText size={20} className="text-primary-600 dark:text-primary-400" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {template.name}
                      </h3>
                    </div>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${getCategoryColor(
                        template.category
                      )}`}
                    >
                      {template.category}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(template)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(template.id)}
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {template.description}
                </p>
                <div className="space-y-2 text-xs">
                  {template.fields.chiefComplaint && (
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Chief Complaint:
                      </span>
                      <p className="text-gray-600 dark:text-gray-400 truncate">
                        {template.fields.chiefComplaint}
                      </p>
                    </div>
                  )}
                  {template.fields.diagnosis && (
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Diagnosis:
                      </span>
                      <p className="text-gray-600 dark:text-gray-400 truncate">
                        {template.fields.diagnosis}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Template Form Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTemplate(undefined);
        }}
        title={editingTemplate ? 'Edit Template' : 'New Template'}
        size="lg"
      >
        <TemplateForm
          template={editingTemplate}
          onSave={handleSaved}
          onCancel={() => {
            setModalOpen(false);
            setEditingTemplate(undefined);
          }}
        />
      </Modal>
    </div>
  );
};

interface TemplateFormProps {
  template?: VisitTemplate;
  onSave: () => void;
  onCancel: () => void;
}

const TemplateForm: React.FC<TemplateFormProps> = ({ template, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'custom' as VisitTemplate['category'],
    chiefComplaint: '',
    examinationFindings: '',
    diagnosis: '',
    treatmentPlan: '',
    prescriptions: '',
    labOrders: '',
    followUp: '',
    notes: '',
  });

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        description: template.description,
        category: template.category,
        chiefComplaint: template.fields.chiefComplaint || '',
        examinationFindings: template.fields.examinationFindings || '',
        diagnosis: template.fields.diagnosis || '',
        treatmentPlan: template.fields.treatmentPlan || '',
        prescriptions: template.fields.prescriptions || '',
        labOrders: template.fields.labOrders || '',
        followUp: template.fields.followUp || '',
        notes: template.fields.notes || '',
      });
    }
  }, [template]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const templateData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      fields: {
        chiefComplaint: formData.chiefComplaint,
        examinationFindings: formData.examinationFindings,
        diagnosis: formData.diagnosis,
        treatmentPlan: formData.treatmentPlan,
        prescriptions: formData.prescriptions,
        labOrders: formData.labOrders,
        followUp: formData.followUp,
        notes: formData.notes,
      },
    };

    if (template) {
      await templateService.updateTemplate(template.id, templateData);
    } else {
      await templateService.createTemplate(templateData);
    }

    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Template Name *"
        value={formData.name}
        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
        required
        fullWidth
      />

      <TextArea
        label="Description *"
        value={formData.description}
        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
        required
        rows={2}
        fullWidth
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Category *
        </label>
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, category: e.target.value as any }))
          }
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="general">General</option>
          <option value="follow-up">Follow-up</option>
          <option value="urgent">Urgent</option>
          <option value="specialist">Specialist</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <TextArea
        label="Chief Complaint"
        value={formData.chiefComplaint}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, chiefComplaint: e.target.value }))
        }
        rows={2}
        fullWidth
      />

      <TextArea
        label="Examination Findings"
        value={formData.examinationFindings}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, examinationFindings: e.target.value }))
        }
        rows={3}
        fullWidth
      />

      <TextArea
        label="Diagnosis"
        value={formData.diagnosis}
        onChange={(e) => setFormData((prev) => ({ ...prev, diagnosis: e.target.value }))}
        rows={2}
        fullWidth
      />

      <TextArea
        label="Treatment Plan"
        value={formData.treatmentPlan}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, treatmentPlan: e.target.value }))
        }
        rows={3}
        fullWidth
      />

      <TextArea
        label="Follow-up"
        value={formData.followUp}
        onChange={(e) => setFormData((prev) => ({ ...prev, followUp: e.target.value }))}
        rows={2}
        fullWidth
      />

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {template ? 'Update Template' : 'Create Template'}
        </Button>
      </div>
    </form>
  );
};
