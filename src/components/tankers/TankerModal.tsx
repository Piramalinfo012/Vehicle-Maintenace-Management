import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Tanker, TankerStatus } from '../../types';
import { formatToDDMMYYYY, getTodayDDMMYYYY } from '../../utils/dateUtils';
import { getGoogleSheetsUrl } from '../../services/googleSheetsSync';

// Google Drive folder where vehicle photos are uploaded via the Apps
// Script's uploadFile action (same folder used for service bill uploads).
const PHOTO_UPLOAD_FOLDER_ID = '1l4vqGTOsjefmSOjoLUubk0d-RyNRF4ez';

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split('base64,')[1] || '');
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

interface TankerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tanker: Partial<Tanker>) => void;
  initialData?: Tanker | null;
}

export const TankerModal: React.FC<TankerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<Tanker>>({
    tankerNumber: '',
    registrationNumber: '',
    vehicleType: 'Petroleum Tanker',
    capacity: '24,000 Litres',
    manufacturer: 'BharatBenz',
    model: '',
    engineNumber: '',
    chassisNumber: '',
    purchaseDate: getTodayDDMMYYYY(),
    purchaseCost: 4000000,
    owner: 'Piramal Petroleum Fleet Ops',
    driver: '',
    transporter: 'Piramal Logistics Ltd',
    currentKm: 120000,
    status: 'Available',
    location: 'Mumbai Terminal Depot',
    remarks: '',
  });
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        tankerNumber: `MH-04-FK-${Math.floor(1000 + Math.random() * 9000)}`,
        registrationNumber: `MH04FK${Math.floor(1000 + Math.random() * 9000)}`,
        vehicleType: 'Petroleum Tanker',
        capacity: '24,000 Litres',
        manufacturer: 'BharatBenz',
        model: '2823R 6x2',
        engineNumber: `ENG-BB-${Math.floor(100000 + Math.random() * 900000)}`,
        chassisNumber: `CHS-BB-${Math.floor(100000 + Math.random() * 900000)}`,
        purchaseDate: '15-01-2023',
        purchaseCost: 4200000,
        owner: 'Piramal Petroleum Fleet Ops',
        driver: 'Ramesh Pawar',
        transporter: 'Piramal Logistics Ltd',
        currentKm: 110000,
        status: 'Available',
        location: 'Mumbai Depot Terminal 1',
        remarks: 'Calibrated multi-valve tanker unit.',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      purchaseDate: formatToDDMMYYYY(formData.purchaseDate),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit Vehicle ${initialData.tankerNumber}` : 'Add New Vehicle / Car to Fleet Master'}
      subtitle="Register director cars, executive sedans, SUVs, company vehicles, or heavy tankers"
      maxWidth="4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Vehicle / Reg Number *
            </label>
            <input
              type="text"
              required
              value={formData.tankerNumber || ''}
              onChange={(e) => setFormData({ ...formData, tankerNumber: e.target.value })}
              placeholder="e.g. MH-01-DIR-0001 or MH-04-FK-1201"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Registration Number *
            </label>
            <input
              type="text"
              required
              value={formData.registrationNumber || ''}
              onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              placeholder="e.g. MH01DIR0001"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Vehicle Category / Type *
            </label>
            <select
              value={formData.vehicleType || 'Company Car'}
              onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value as any })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            >
              <option value="Director Car / Luxury Sedan">Director Car / Luxury Sedan</option>
              <option value="Executive SUV">Executive SUV</option>
              <option value="Company Car">Company Car</option>
              <option value="Staff Transport Van">Staff Transport Van</option>
              <option value="Petroleum Tanker">Petroleum Tanker</option>
              <option value="Fuel Tanker">Fuel Tanker</option>
              <option value="Chemical Tanker">Chemical Tanker</option>
              <option value="LPG Tanker">LPG Tanker</option>
              <option value="Water Tanker">Water Tanker</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Capacity / Seating *
            </label>
            <input
              type="text"
              required
              value={formData.capacity || ''}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              placeholder="e.g. 5 Seater, 7 Seater, 24,000 Litres"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Manufacturer
            </label>
            <input
              type="text"
              value={formData.manufacturer || ''}
              onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
              placeholder="e.g. Mercedes-Benz, Toyota, Honda, Tata"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Model
            </label>
            <input
              type="text"
              value={formData.model || ''}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              placeholder="e.g. 2823R 6x2"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Engine Number
            </label>
            <input
              type="text"
              value={formData.engineNumber || ''}
              onChange={(e) => setFormData({ ...formData, engineNumber: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Chassis Number
            </label>
            <input
              type="text"
              value={formData.chassisNumber || ''}
              onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Current Odometer (KM)
            </label>
            <input
              type="number"
              value={formData.currentKm || 0}
              onChange={(e) => setFormData({ ...formData, currentKm: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Status *
            </label>
            <select
              value={formData.status || 'Available'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as TankerStatus })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            >
              <option value="Available">Available</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Breakdown">Breakdown</option>
              <option value="In Transit">In Transit</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Assigned Driver
            </label>
            <input
              type="text"
              value={formData.driver || ''}
              onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
              placeholder="Driver Full Name"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Depot / Location
            </label>
            <input
              type="text"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Mumbai Terminal Depot 1"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Vehicle Photo / Image Upload
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            {formData.photoUrl ? (
              <div className="relative w-24 h-20 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-900">
                <img
                  src={formData.photoUrl}
                  alt="Vehicle Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, photoUrl: '' })}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full text-[10px] hover:bg-red-700"
                  title="Remove Image"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="w-24 h-20 rounded-lg bg-slate-200 dark:bg-slate-700 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 shrink-0 text-center p-2">
                <span className="text-xl mb-1">📷</span>
                <span className="text-[10px] font-medium">No Image</span>
              </div>
            )}

            <div className="flex-1 space-y-2 w-full">
              <div className="flex items-center gap-2">
                <label className={`px-3 py-1.5 bg-[#1E3A8A] text-white text-xs font-semibold rounded-lg hover:bg-blue-800 cursor-pointer transition-all inline-flex items-center gap-1.5 shadow-sm ${isUploadingPhoto ? 'opacity-60 pointer-events-none' : ''}`}>
                  <span>{isUploadingPhoto ? '⏳ Uploading...' : '📁 Upload Image File'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploadingPhoto}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      setIsUploadingPhoto(true);
                      try {
                        const base64Data = await fileToBase64(file);
                        const res = await fetch(getGoogleSheetsUrl(), {
                          method: 'POST',
                          body: new URLSearchParams({
                            action: 'uploadFile',
                            base64Data,
                            fileName: file.name,
                            mimeType: file.type || 'application/octet-stream',
                            folderId: PHOTO_UPLOAD_FOLDER_ID,
                          }),
                        });
                        const result = await res.json();
                        if (result.success) {
                          setFormData((prev) => ({ ...prev, photoUrl: result.fileUrl }));
                        } else {
                          console.error('Failed to upload vehicle photo:', result.error);
                        }
                      } catch (err) {
                        console.error('Failed to upload vehicle photo:', err);
                      } finally {
                        setIsUploadingPhoto(false);
                      }
                    }}
                  />
                </label>
                <span className="text-[11px] text-slate-500">or paste URL below</span>
              </div>
              <input
                type="url"
                value={formData.photoUrl || ''}
                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                placeholder="https://example.com/vehicle-image.jpg"
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Remarks / Special Calibration Setup
          </label>
          <textarea
            rows={2}
            value={formData.remarks || ''}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            placeholder="Enter additional remarks or hazard specifications..."
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold text-white bg-[#1E3A8A] hover:bg-blue-800 rounded-lg shadow-sm"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};
