
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/context/DataContext';
import { Calendar } from 'lucide-react';

interface TournamentFormData {
  startDate: string;
  endDate: string;
  location: string;
}

const DistrictTournamentForm: React.FC<{ districtId: string }> = ({ districtId }) => {
  const { districts, updateDistrict } = useData();
  const { toast } = useToast();
  const district = districts.find(d => d.id === districtId);

  const form = useForm<TournamentFormData>({
    defaultValues: {
      startDate: district?.tournamentDates?.start || '',
      endDate: district?.tournamentDates?.end || '',
      location: district?.tournamentLocation || ''
    }
  });

  const onSubmit = (data: TournamentFormData) => {
    if (!district) return;

    const updatedDistrict = {
      ...district,
      tournamentDates: {
        start: data.startDate,
        end: data.endDate
      },
      tournamentLocation: data.location,
      tournamentYear: new Date().getFullYear()
    };

    updateDistrict(updatedDistrict);

    toast({
      title: 'Tournament Details Updated',
      description: `Tournament for ${district.name} has been scheduled.`
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-tennis-blue" />
          Schedule District Tournament
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tournament Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tournament End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tournament Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tournament venue" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Update Tournament Details
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DistrictTournamentForm;
