import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Key, Shield, User, Lock } from 'lucide-react';

interface KeystoreDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (keystoreData: KeystoreData) => void;
  projectName: string;
}

export interface KeystoreData {
  keystorePassword: string;
  keyAlias: string;
  keyPassword: string;
  storeFile?: string;
  createNew: boolean;
  // For new keystore creation
  organizationName?: string;
  organizationUnit?: string;
  locality?: string;
  state?: string;
  country?: string;
  validity?: number;
}

export default function KeystoreDialog({ isOpen, onClose, onSubmit, projectName }: KeystoreDialogProps) {
  const [keystoreData, setKeystoreData] = useState<KeystoreData>({
    keystorePassword: '',
    keyAlias: 'release',
    keyPassword: '',
    createNew: true,
    organizationName: '',
    organizationUnit: '',
    locality: '',
    state: '',
    country: '',
    validity: 25
  });

  const handleSubmit = () => {
    if (!keystoreData.keystorePassword || !keystoreData.keyAlias || !keystoreData.keyPassword) {
      alert('Please fill in all required fields');
      return;
    }

    if (keystoreData.createNew && (!keystoreData.organizationName || !keystoreData.country)) {
      alert('Please fill in organization name and country for new keystore');
      return;
    }

    onSubmit(keystoreData);
  };

  const handleInputChange = (field: keyof KeystoreData, value: string | number | boolean) => {
    setKeystoreData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Keystore Configuration Required
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              A keystore is required to sign your APK for release. You can create a new keystore or use an existing one.
            </AlertDescription>
          </Alert>

          <div className="flex gap-4">
            <Button 
              variant={keystoreData.createNew ? "default" : "outline"}
              onClick={() => handleInputChange('createNew', true)}
              className="flex-1"
            >
              <Shield className="h-4 w-4 mr-2" />
              Create New Keystore
            </Button>
            <Button 
              variant={!keystoreData.createNew ? "default" : "outline"}
              onClick={() => handleInputChange('createNew', false)}
              className="flex-1"
            >
              <Key className="h-4 w-4 mr-2" />
              Use Existing Keystore
            </Button>
          </div>

          {!keystoreData.createNew && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Existing Keystore</CardTitle>
                <CardDescription>
                  Provide details for your existing keystore file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="storeFile">Keystore File Path</Label>
                  <Input
                    id="storeFile"
                    placeholder="e.g., /path/to/release.keystore"
                    value={keystoreData.storeFile || ''}
                    onChange={(e) => handleInputChange('storeFile', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {keystoreData.createNew && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">New Keystore Details</CardTitle>
                <CardDescription>
                  Certificate information for your new keystore
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="organizationName">Organization Name *</Label>
                    <Input
                      id="organizationName"
                      placeholder="e.g., My Company"
                      value={keystoreData.organizationName || ''}
                      onChange={(e) => handleInputChange('organizationName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="organizationUnit">Organization Unit</Label>
                    <Input
                      id="organizationUnit"
                      placeholder="e.g., Development"
                      value={keystoreData.organizationUnit || ''}
                      onChange={(e) => handleInputChange('organizationUnit', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="locality">City/Locality</Label>
                    <Input
                      id="locality"
                      placeholder="e.g., San Francisco"
                      value={keystoreData.locality || ''}
                      onChange={(e) => handleInputChange('locality', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      placeholder="e.g., California"
                      value={keystoreData.state || ''}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country">Country Code *</Label>
                    <Input
                      id="country"
                      placeholder="e.g., US"
                      value={keystoreData.country || ''}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      maxLength={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="validity">Validity (Years)</Label>
                    <Input
                      id="validity"
                      type="number"
                      value={keystoreData.validity || 25}
                      onChange={(e) => handleInputChange('validity', parseInt(e.target.value) || 25)}
                      min={1}
                      max={100}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Keystore Credentials</CardTitle>
              <CardDescription>
                Security credentials for signing your APK
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="keystorePassword">Keystore Password *</Label>
                <Input
                  id="keystorePassword"
                  type="password"
                  placeholder="Enter keystore password"
                  value={keystoreData.keystorePassword}
                  onChange={(e) => handleInputChange('keystorePassword', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="keyAlias">Key Alias *</Label>
                <Input
                  id="keyAlias"
                  placeholder="release"
                  value={keystoreData.keyAlias}
                  onChange={(e) => handleInputChange('keyAlias', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="keyPassword">Key Password *</Label>
                <Input
                  id="keyPassword"
                  type="password"
                  placeholder="Enter key password"
                  value={keystoreData.keyPassword}
                  onChange={(e) => handleInputChange('keyPassword', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="min-w-32">
            <Lock className="h-4 w-4 mr-2" />
            Generate APK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}