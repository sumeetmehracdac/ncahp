import { User, Mail, Phone, MapPin, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SectionCard from '../components/SectionCard';
import { FormFieldGroup, FormRow, FormDivider } from '../components/FormFieldGroup';
import { ProvisionalFormData, indianStates } from '../types';

interface Props {
  formData: ProvisionalFormData;
  updateFormData: <K extends keyof ProvisionalFormData>(field: K, value: ProvisionalFormData[K]) => void;
  sectionRef: React.RefObject<HTMLDivElement>;
}

export default function PersonalInfoSection({ formData, updateFormData, sectionRef }: Props) {
  const updateAddress = (type: 'permanentAddress' | 'correspondenceAddress', field: string, value: string) => {
    updateFormData(type, {
      ...formData[type],
      [field]: value
    });
  };

  return (
    <SectionCard
      ref={sectionRef}
      id="personal"
      number={1}
      title="Personal Information"
      tagline="Basic information of applicant"
      icon={<User className="w-5 h-5" />}
    >
      {/* Basic Details */}
      <div className="space-y-6">
        <FormRow columns={3}>
          <FormFieldGroup label="First Name" required>
            <Input
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={(e) => updateFormData('firstName', e.target.value)}
              className="h-11"
            />
          </FormFieldGroup>
          <FormFieldGroup label="Middle Name">
            <Input
              placeholder="Enter middle name (optional)"
              value={formData.middleName}
              onChange={(e) => updateFormData('middleName', e.target.value)}
              className="h-11"
            />
          </FormFieldGroup>
          <FormFieldGroup label="Last Name" required>
            <Input
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={(e) => updateFormData('lastName', e.target.value)}
              className="h-11"
            />
          </FormFieldGroup>
        </FormRow>

        <FormRow columns={3}>
          <FormFieldGroup label="Gender" required>
            <RadioGroup
              value={formData.gender}
              onValueChange={(value) => updateFormData('gender', value as 'male' | 'female' | 'other')}
              className="flex gap-4 pt-2"
            >
              {['male', 'female', 'other'].map((g) => (
                <div key={g} className="flex items-center space-x-2">
                  <RadioGroupItem value={g} id={`gender-${g}`} />
                  <Label htmlFor={`gender-${g}`} className="capitalize cursor-pointer">
                    {g}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FormFieldGroup>
          <FormFieldGroup label="Date of Birth" required>
            <Input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
              className="h-11"
            />
          </FormFieldGroup>
          <FormFieldGroup label="Nationality" required>
            <Select
              value={formData.nationality}
              onValueChange={(value) => updateFormData('nationality', value)}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select nationality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Indian">Indian</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </FormFieldGroup>
        </FormRow>

        <FormDivider label="Contact Information" />

        <FormRow columns={3}>
          <FormFieldGroup label="Email Address" required>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className="h-11 pl-10"
              />
            </div>
          </FormFieldGroup>
          <FormFieldGroup label="Mobile Number" required>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={formData.mobile}
                onChange={(e) => updateFormData('mobile', e.target.value)}
                className="h-11 pl-10"
                maxLength={15}
              />
            </div>
          </FormFieldGroup>
          <FormFieldGroup label="Aadhaar Number" required hint="12-digit Aadhaar number">
            <Input
              placeholder="XXXX XXXX XXXX"
              value={formData.aadhaarNumber}
              onChange={(e) => updateFormData('aadhaarNumber', e.target.value)}
              className="h-11"
              maxLength={14}
            />
          </FormFieldGroup>
        </FormRow>

        <FormDivider label="Family Details" />

        <FormRow columns={2}>
          <FormFieldGroup label="Father's Name" required>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Enter father's full name"
                value={formData.fatherName}
                onChange={(e) => updateFormData('fatherName', e.target.value)}
                className="h-11 pl-10"
              />
            </div>
          </FormFieldGroup>
          <FormFieldGroup label="Mother's Name" required>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Enter mother's full name"
                value={formData.motherName}
                onChange={(e) => updateFormData('motherName', e.target.value)}
                className="h-11 pl-10"
              />
            </div>
          </FormFieldGroup>
        </FormRow>

        <FormDivider label="Permanent Address" />

        <FormRow columns={2}>
          <FormFieldGroup label="Address Line 1" required className="md:col-span-2">
            <Input
              placeholder="House/Flat No., Building Name, Street"
              value={formData.permanentAddress.addressLine1}
              onChange={(e) => updateAddress('permanentAddress', 'addressLine1', e.target.value)}
              className="h-11"
            />
          </FormFieldGroup>
        </FormRow>
        <FormRow columns={2}>
          <FormFieldGroup label="Address Line 2" className="md:col-span-2">
            <Input
              placeholder="Area, Locality, Landmark (Optional)"
              value={formData.permanentAddress.addressLine2}
              onChange={(e) => updateAddress('permanentAddress', 'addressLine2', e.target.value)}
              className="h-11"
            />
          </FormFieldGroup>
        </FormRow>
        <FormRow columns={4}>
          <FormFieldGroup label="City" required>
            <Input
              placeholder="City"
              value={formData.permanentAddress.city}
              onChange={(e) => updateAddress('permanentAddress', 'city', e.target.value)}
              className="h-11"
            />
          </FormFieldGroup>
          <FormFieldGroup label="District" required>
            <Input
              placeholder="District"
              value={formData.permanentAddress.district}
              onChange={(e) => updateAddress('permanentAddress', 'district', e.target.value)}
              className="h-11"
            />
          </FormFieldGroup>
          <FormFieldGroup label="State" required>
            <Select
              value={formData.permanentAddress.state}
              onValueChange={(value) => updateAddress('permanentAddress', 'state', value)}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {indianStates.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldGroup>
          <FormFieldGroup label="Pincode" required>
            <Input
              placeholder="6-digit pincode"
              value={formData.permanentAddress.pincode}
              onChange={(e) => updateAddress('permanentAddress', 'pincode', e.target.value)}
              className="h-11"
              maxLength={6}
            />
          </FormFieldGroup>
        </FormRow>

        {/* Correspondence Address Toggle */}
        <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
          <Checkbox
            id="sameAddress"
            checked={formData.correspondenceAddressSame}
            onCheckedChange={(checked) => updateFormData('correspondenceAddressSame', checked as boolean)}
          />
          <Label htmlFor="sameAddress" className="text-sm cursor-pointer">
            Correspondence address is same as permanent address
          </Label>
        </div>

        {/* Correspondence Address (if different) */}
        <AnimatePresence>
          {!formData.correspondenceAddressSame && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 overflow-hidden"
            >
              <FormDivider label="Correspondence Address" />
              <FormRow columns={2}>
                <FormFieldGroup label="Address Line 1" required className="md:col-span-2">
                  <Input
                    placeholder="House/Flat No., Building Name, Street"
                    value={formData.correspondenceAddress.addressLine1}
                    onChange={(e) => updateAddress('correspondenceAddress', 'addressLine1', e.target.value)}
                    className="h-11"
                  />
                </FormFieldGroup>
              </FormRow>
              <FormRow columns={2}>
                <FormFieldGroup label="Address Line 2" className="md:col-span-2">
                  <Input
                    placeholder="Area, Locality, Landmark (Optional)"
                    value={formData.correspondenceAddress.addressLine2}
                    onChange={(e) => updateAddress('correspondenceAddress', 'addressLine2', e.target.value)}
                    className="h-11"
                  />
                </FormFieldGroup>
              </FormRow>
              <FormRow columns={4}>
                <FormFieldGroup label="City" required>
                  <Input
                    placeholder="City"
                    value={formData.correspondenceAddress.city}
                    onChange={(e) => updateAddress('correspondenceAddress', 'city', e.target.value)}
                    className="h-11"
                  />
                </FormFieldGroup>
                <FormFieldGroup label="District" required>
                  <Input
                    placeholder="District"
                    value={formData.correspondenceAddress.district}
                    onChange={(e) => updateAddress('correspondenceAddress', 'district', e.target.value)}
                    className="h-11"
                  />
                </FormFieldGroup>
                <FormFieldGroup label="State" required>
                  <Select
                    value={formData.correspondenceAddress.state}
                    onValueChange={(value) => updateAddress('correspondenceAddress', 'state', value)}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianStates.map((state) => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormFieldGroup>
                <FormFieldGroup label="Pincode" required>
                  <Input
                    placeholder="6-digit pincode"
                    value={formData.correspondenceAddress.pincode}
                    onChange={(e) => updateAddress('correspondenceAddress', 'pincode', e.target.value)}
                    className="h-11"
                    maxLength={6}
                  />
                </FormFieldGroup>
              </FormRow>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionCard>
  );
}
