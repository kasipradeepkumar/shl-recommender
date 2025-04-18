'use client';

import {rankAssessments, RankAssessmentsOutput} from '@/ai/flows/rank-assessments';
import {getShlAssessments, ShlAssessment} from '@/services/shl';
import {useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Skeleton} from '@/components/ui/skeleton';
import {cn} from '@/lib/utils';

export const AssessmentRecommendations = ({recommendationsRequested}: {recommendationsRequested: boolean}) => {
  const searchParams = useSearchParams();
  const purpose = searchParams.get('purpose') || '';
  const roleType = searchParams.get('roleType') || '';
  const [assessments, setAssessments] = useState<ShlAssessment[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAssessments = async () => {
      if (!recommendationsRequested) {
        setAssessments(null);
        return;
      }

      setLoading(true);
      try {
        const shlAssessments = await getShlAssessments({purpose, roleType});
        setAssessments(shlAssessments);
      } catch (error) {
        console.error('Failed to load assessments:', error);
        setAssessments([]);
      } finally {
        setLoading(false);
      }
    };

    loadAssessments();
  }, [purpose, roleType, recommendationsRequested]);

  return (
    <div>
      {recommendationsRequested === false ? (
        <p className="text-muted-foreground">Click Get Recommendation button to see assessment recommendations.</p>
      ) : loading ? (
        <div className="grid gap-4">
          <Skeleton className="h-16 w-full"/>
          <Skeleton className="h-16 w-full"/>
        </div>
      ) : assessments && assessments.length > 0 ? (
        <div className="grid gap-4">
          {assessments.map((assessment) => (
            <Card key={assessment.name}>
              <CardHeader>
                <CardTitle>{assessment.name}</CardTitle>
                <CardDescription>{assessment.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  Type: {assessment.type}
                </div>
                <div className="mb-2">
                  Focus: {assessment.focus.join(', ')}
                </div>
                <div className="mb-2">
                  Application: {assessment.application.join(', ')}
                </div>
                <div>
                  Estimated Duration: {assessment.estimated_duration}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        assessments !== null && <p>No assessments found for the selected criteria.</p>
      )}
    </div>
  );
};

