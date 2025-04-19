import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { School, District, Classification } from '@/types';
import SchoolFormDialog from '@/components/schools/SchoolFormDialog';
import SchoolsHeader from '@/components/schools/SchoolsHeader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Search, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import GroupedSchoolsList from '@/components/schools/GroupedSchoolsList';
import BulkDistrictAssignment from '@/components/schools/BulkDistrictAssignment';

const Schools = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
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
  
  useEffect(() => {
    console.log(`Schools page loaded with ${schools.length} schools`);
    console.log('Districts available:', districts.length);
  }, [schools, districts]);
  
  const availableDistricts = districts.filter(district => district.classification === formData.classification);
  
  useEffect(() => {
    const fetchSchoolsAndDistricts = async () => {
      const { data: districtData, error: districtError } = await supabase
        .from('districts')
        .select('*');

      if (districtError) {
        console.error('Error fetching districts:', districtError);
        return;
      }

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
        return;
      }

      const formattedSchools: School[] = schoolData.map(school => ({
        id: school.id,
        name: school.name,
        classification: school.classification as Classification,
        districtId: school.district_id,
        city: school.city,
        state: school.state
      }));

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

      setSchools(formattedSchools);
      setDistricts(formattedDistricts);
      setIsLoading(false);
    };

    fetchSchoolsAndDistricts();
  }, []);
    
  const filteredSchools = schools.filter(school => {
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
    
    setSchools([...schools, newSchool]);
    setFormData({ name: '', classification: '6A', districtId: '', city: '', state: 'OR' });
    setIsAddDialogOpen(false);
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
      
      setSchools(schools.map(school => school.id === editingSchool.id ? updatedSchool : school));
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
    const district = districts.find(d => d.id === districtId);
    return district ? district.name : 'Unknown District';
  };

  const handleBulkDistrictAssignment = (schoolIds: string[], districtId: string) => {
    schoolIds.forEach(async schoolId => {
      const school = schools.find(s => s.id === schoolId);
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
          return;
        }
        
        setSchools(schools.map(s => s.id === schoolId ? updatedSchool : s));
      }
    });
  };

  if (isLoading) {
    return <div>Loading schools...</div>;
  }

  return (
    <div className="space-y-6">
      <SchoolsHeader 
        schoolCount={schools.length}
        filteredCount={filteredSchools.length}
        isAdmin={true}
        onAddClick={() => setIsAddDialogOpen(true)}
      />
      
      <BulkDistrictAssignment
        schools={schools}
        districts={districts}
        onAssignDistrict={handleBulkDistrictAssignment}
      />

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
                {districts.map(district => (
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
            districts={districts}
            canEdit={true}
            onEditSchool={openEditDialog}
          />
        )}
      </div>
      
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
