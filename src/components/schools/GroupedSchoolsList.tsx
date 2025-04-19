
import React, { useEffect } from 'react';
import { School, Classification, District } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { School as SchoolIcon, Edit, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface GroupedSchoolsListProps {
  schools: School[];
  districts: District[];
  canEdit: boolean;
  onEditSchool: (school: School) => void;
}

const GroupedSchoolsList = ({ schools, districts, canEdit, onEditSchool }: GroupedSchoolsListProps) => {
  const classifications: Classification[] = ['6A', '5A', '4A/3A/2A/1A'];
  
  // Log for debugging
  useEffect(() => {
    console.log(`GroupedSchoolsList received ${schools.length} schools`);
    if (schools.length > 0) {
      console.log('Sample school:', schools[0]);
    }
  }, [schools]);
  
  // Get district name helper
  const getDistrictName = (districtId: string): string => {
    const district = districts.find(d => d.id === districtId);
    return district ? district.name : 'Unknown District';
  };
  
  // Group schools by district within each classification
  const groupSchoolsByDistrict = (classificationSchools: School[]) => {
    const groupedByDistrict: { [key: string]: School[] } = {};
    
    classificationSchools.forEach(school => {
      const districtId = school.districtId;
      if (!groupedByDistrict[districtId]) {
        groupedByDistrict[districtId] = [];
      }
      groupedByDistrict[districtId].push(school);
    });
    
    return groupedByDistrict;
  };

  if (schools.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No schools found. Please add schools to get started.</p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="6A" className="w-full">
      <TabsList className="mb-4">
        {classifications.map((classification) => (
          <TabsTrigger key={classification} value={classification}>
            {classification}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {classifications.map((classification) => {
        const classificationSchools = schools.filter(
          school => school.classification === classification
        );
        
        if (classificationSchools.length === 0) {
          return (
            <TabsContent key={classification} value={classification}>
              <div className="text-center py-10">
                <p className="text-gray-500">No {classification} schools found.</p>
              </div>
            </TabsContent>
          );
        }
        
        const groupedByDistrict = groupSchoolsByDistrict(classificationSchools);
        
        return (
          <TabsContent key={classification} value={classification}>
            {Object.entries(groupedByDistrict).map(([districtId, districtSchools]) => (
              <Card key={districtId} className="mb-4">
                <CardHeader>
                  <CardTitle className="text-lg text-tennis-blue">
                    {getDistrictName(districtId)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {districtSchools.map((school) => (
                      <Card key={school.id} className="overflow-hidden">
                        <CardHeader className="bg-tennis-gray pb-2 flex flex-row justify-between items-center">
                          <CardTitle className="text-lg flex items-center">
                            <SchoolIcon className="h-5 w-5 mr-2 text-tennis-blue" />
                            {school.name}
                          </CardTitle>
                          
                          {canEdit && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => onEditSchool(school)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-center mt-4">
                            <div className="text-sm text-gray-500">Teams</div>
                            <Link to={`/teams?school=${school.id}`}>
                              <Button variant="outline" size="sm" className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                Manage Teams
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

export default GroupedSchoolsList;
