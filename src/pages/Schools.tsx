import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { School, District, Classification } from '@/types';
import SchoolFormDialog from '@/components/schools/SchoolFormDialog';
import SchoolsHeader from '@/components/schools/SchoolsHeader';
import { SchoolImportButton } from '@/components/schools/SchoolImportButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Search, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import GroupedSchoolsList from '@/components/schools/GroupedSchoolsList';
import BulkDistrictAssignment from '@/components/schools/BulkDistrictAssignment';
import { useData } from '@/context/DataContext';
import { useToast } from '@/components/ui/use-toast';

const Schools = () => {
  const { schools: contextSchools, districts: contextDistricts, setSchools, setDistricts } = useData();
  const [localSchools, setLocalSchools] = useState<School[]>([]);
  const [localDistricts, setLocalDistricts] = useState<District[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    classification: Classification;
    districtId: string;
    city: string;
    state: string;
  }>({
    name: '',
    classification: '6A',
    districtId: '',
    city: '',
    state: 'OR'
  });
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  
  const [classificationFilter, setClassificationFilter] = useState<Classification | 'all'>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grouped'>('table');
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    console.log(`Schools page loaded with ${contextSchools.length} schools from context`);
    setLocalSchools(contextSchools);
    setLocalDistricts(contextDistricts);
    setIsLoading(false);
    
    if (contextSchools.length < 5) {
      fetchSchoolsAndDistricts();
    }
  }, [contextSchools, contextDistricts]);
  
  const availableDistricts = localDistricts.filter(district => district.classification === formData.classification);
  
  const fetchSchoolsAndDistricts = async () => {
    setIsLoading(true);
    setFetchError(null);
    
    console.log('Fetching districts from Supabase...');
    const { data: districtData, error: districtError } = await supabase
      .from('districts')
      .select('*');

    if (districtError) {
      console.error('Error fetching districts:', districtError);
      setFetchError(`Error fetching districts: ${districtError.message}`);
      setIsLoading(false);
      return;
    }

    console.log(`Found ${districtData?.length || 0} districts in database`);

    if (districtData && districtData.length > 0) {
      const formattedDistricts: District[] = districtData.map(district => ({
        id: district.id,
        name: district.name,
        code: district.code,
        classification: district.classification as Classification,
        tournamentDates: district.tournament_dates ? {
          start: Array.isArray(district.tournament_dates) && district.tournament_dates.length > 0 
            ? district.tournament_dates[0] : '',
          end: Array.isArray(district.tournament_dates) && district.tournament_dates.length > 1 
            ? district.tournament_dates[1] : ''
        } : undefined,
        tournamentLocation: district.tournament_location
      }));
      
      setLocalDistricts(formattedDistricts);
      setDistricts(formattedDistricts);
    }

    console.log('Fetching schools from Supabase...');
    const { data: schoolData, error: schoolError } = await supabase
      .from('schools')
      .select(`
        id,
        name,
        classification,
        city,
        state,
        district_id
      `);

    if (schoolError) {
      console.error('Error fetching schools:', schoolError);
      setFetchError(`Error fetching schools: ${schoolError.message}`);
      setIsLoading(false);
      return;
    }

    console.log(`Found ${schoolData?.length || 0} schools in database`);

    if (schoolData && schoolData.length > 0) {
      const formattedSchools: School[] = schoolData.map(school => ({
        id: school.id,
        name: school.name,
        classification: school.classification as Classification,
        districtId: school.district_id,
        city: school.city,
        state: school.state
      }));
      
      if (formattedSchools.length > contextSchools.length) {
        setLocalSchools(formattedSchools);
        setSchools(formattedSchools);
        toast({
          title: "Schools Loaded",
          description: `Loaded ${formattedSchools.length} schools from database.`
        });
      }
    }

    setIsLoading(false);
  };
    
  const filteredSchools = localSchools.filter(school => {
    if (classificationFilter !== 'all' && school.classification !== classificationFilter) {
      return false;
    }
    
    if (districtFilter !== 'all' && school.districtId !== districtFilter) {
      return false;
    }
    
    if (searchTerm.trim() !== '') {
      return school.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    return true;
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data, error } = await supabase
      .from('schools')
      .insert({
        name: formData.name,
        classification: formData.classification,
        district_id: formData.districtId,
        city: formData.city,
        state: formData.state
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error adding school:', error);
      toast({
        title: "Error",
        description: `Failed to add school: ${error.message}`,
        variant: "destructive"
      });
      return;
    }
    
    const newSchool: School = {
      id: data.id,
      name: data.name,
      classification: data.classification as Classification,
      districtId: data.district_id,
      city: data.city,
      state: data.state
    };
    
    const updatedSchools = [...localSchools, newSchool];
    setLocalSchools(updatedSchools);
    setSchools(updatedSchools);
    
    setFormData({ name: '', classification: '6A', districtId: '', city: '', state: 'OR' });
    setIsAddDialogOpen(false);
    
    toast({
      title: "School Added",
      description: `${newSchool.name} has been added successfully.`
    });
  };
  
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSchool) {
      const { data, error } = await supabase
        .from('schools')
        .update({
          name: formData.name,
          classification: formData.classification,
          district_id: formData.districtId,
          city: formData.city,
          state: formData.state
        })
        .eq('id', editingSchool.id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating school:', error);
        toast({
          title: "Error",
          description: `Failed to update school: ${error.message}`,
          variant: "destructive"
        });
        return;
      }
      
      const updatedSchool: School = {
        id: data.id,
        name: data.name,
        classification: data.classification as Classification,
        districtId: data.district_id,
        city: data.city,
        state: data.state
      };
      
      const updatedSchools = localSchools.map(s => 
        school.id === editingSchool.id ? updatedSchool : school
      );
      setLocalSchools(updatedSchools);
      setSchools(updatedSchools);
      
      toast({
        title: "School Updated",
        description: `${updatedSchool.name} has been updated successfully.`
      });
    }
    setIsEditDialogOpen(false);
  };
  
  const handleClassificationChange = (value: Classification) => {
    setFormData({ 
      ...formData, 
      classification: value,
      districtId: '' 
    });
  };
  
  const openEditDialog = (school: School) => {
    setEditingSchool(school);
    setFormData({
      name: school.name,
      classification: school.classification,
      districtId: school.districtId,
      city: school.city || '',
      state: school.state || 'OR'
    });
    setIsEditDialogOpen(true);
  };
  
  const getDistrictName = (districtId: string) => {
    const district = localDistricts.find(d => d.id === districtId);
    return district ? district.name : 'Unknown District';
  };

  const handleBulkDistrictAssignment = (schoolIds: string[], districtId: string) => {
    schoolIds.forEach(async schoolId => {
      const school = localSchools.find(s => s.id === schoolId);
      if (school) {
        const updatedSchool = {
          ...school,
          districtId: districtId
        };
        
        const { error } = await supabase
          .from('schools')
          .update({ district_id: districtId })
          .eq('id', schoolId);
          
        if (error) {
          console.error(`Error updating school ${school.name}:`, error);
          toast({
            title: "Error",
            description: `Failed to update ${school.name}: ${error.message}`,
            variant: "destructive"
          });
          return;
        }
        
        const updatedSchools = localSchools.map(s => s.id === schoolId ? updatedSchool : s);
        setLocalSchools(updatedSchools);
        setSchools(updatedSchools);
        
        toast({
          title: "School Updated",
          description: `${school.name} has been assigned to a new district.`
        });
      }
    });
  };

  if (isLoading) {
    return <div>Loading schools...</div>;
  }

  return (
    <div className="space-y-6">
      <SchoolsHeader 
        schoolCount={localSchools.length}
        filteredCount={filteredSchools.length}
        isAdmin={true}
        onAddClick={() => setIsAddDialogOpen(true)}
      />
      
      <div className="flex justify-between items-center">
        <BulkDistrictAssignment
          schools={localSchools}
          districts={localDistricts}
          onAssignDistrict={handleBulkDistrictAssignment}
        />
        <SchoolImportButton />
      </div>

      {fetchError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{fetchError}</span>
        </div>
      )}

      {localSchools.length === 0 ? (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">No Schools Found: </strong>
          <span className="block sm:inline">Try importing schools using the Import button above.</span>
        </div>
      ) : (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Select
                value={classificationFilter}
                onValueChange={(value: Classification | 'all') => setClassificationFilter(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Classifications" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classifications</SelectItem>
                  <SelectItem value="6A">6A</SelectItem>
                  <SelectItem value="5A">5A</SelectItem>
                  <SelectItem value="4A/3A/2A/1A">4A/3A/2A/1A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select
                value={districtFilter}
                onValueChange={setDistrictFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Districts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {localDistricts.map(district => (
                    <SelectItem key={district.id} value={district.id}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search schools..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end mb-4">
            <div className="space-x-2">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                Table View
              </Button>
              <Button
                variant={viewMode === 'grouped' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grouped')}
              >
                Grouped View
              </Button>
            </div>
          </div>

          {viewMode === 'table' ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>School Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Classification</TableHead>
                      <TableHead>District</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchools.length > 0 ? (
                      filteredSchools.map(school => (
                        <TableRow key={school.id}>
                          <TableCell className="font-medium">{school.name}</TableCell>
                          <TableCell>{school.city}, {school.state}</TableCell>
                          <TableCell>{school.classification}</TableCell>
                          <TableCell>{school.districtId ? getDistrictName(school.districtId) : 'Unknown District'}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/teams?schoolId=${school.id}`}>
                                  <Users className="h-4 w-4 mr-1" />
                                  Teams
                                </Link>
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(school)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No schools found with the current filters
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <GroupedSchoolsList
              schools={filteredSchools}
              districts={localDistricts}
              canEdit={true}
              onEditSchool={openEditDialog}
            />
          )}
        </div>
      )}
      
      <SchoolFormDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAddSubmit}
        availableDistricts={availableDistricts}
        mode="add"
        handleClassificationChange={handleClassificationChange}
      />
      
      <SchoolFormDialog 
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleEditSubmit}
        availableDistricts={availableDistricts}
        mode="edit"
        handleClassificationChange={handleClassificationChange}
      />
    </div>
  );
};

export default Schools;
