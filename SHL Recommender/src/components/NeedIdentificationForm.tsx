'use client';

import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {useRouter, useSearchParams} from 'next/navigation';
import {useState, useCallback} from 'react';
import {AssessmentRecommendations} from './AssessmentRecommendations';

export const NeedsIdentificationForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const purpose = searchParams.get('purpose') || '';
  const roleType = searchParams.get('roleType') || '';
  const [recommendationsRequested, setRecommendationsRequested] = useState(false);

  const updateSearchParams = useCallback((newParams: {purpose?: string, roleType?: string}) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (newParams.purpose !== undefined) {
      if (newParams.purpose === '') {
        newSearchParams.delete('purpose');
      } else {
        newSearchParams.set('purpose', newParams.purpose);
      }
    }
    if (newParams.roleType !== undefined) {
      if (newParams.roleType === '') {
        newSearchParams.delete('roleType');
      } else {
        newSearchParams.set('roleType', newParams.roleType);
      }
    }

    router.push(`/?${newSearchParams.toString()}`);
  }, [router, searchParams]);

  const handlePurposeChange = (value: string) => {
    updateSearchParams({purpose: value});
  };

  const handleRoleTypeChange = (value: string) => {
    updateSearchParams({roleType: value});
  };

  const clearSelections = () => {
    updateSearchParams({});
    setRecommendationsRequested(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRecommendationsRequested(true);
  };

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="purpose">Purpose of Assessment</Label>
          <Select onValueChange={handlePurposeChange} defaultValue={purpose}>
            <SelectTrigger id="purpose">
              <SelectValue placeholder="Select purpose"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Hiring">Hiring</SelectItem>
              <SelectItem value="Development">Development</SelectItem>
              <SelectItem value="Promotion">Promotion</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="roleType">Type of Role</Label>
          <Select onValueChange={handleRoleTypeChange} defaultValue={roleType}>
            <SelectTrigger id="roleType">
              <SelectValue placeholder="Select role type"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Managerial">Managerial</SelectItem>
              <SelectItem value="Technical">Technical</SelectItem>
              <SelectItem value="Entry-Level">Entry-Level</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button type="submit">
            Get Recommendations
          </Button>
          <Button type="button" variant="outline" onClick={clearSelections}>
            Clear Selections
          </Button>
        </div>
      </form>
      <AssessmentRecommendations recommendationsRequested={recommendationsRequested} />
    </>
  );
};
