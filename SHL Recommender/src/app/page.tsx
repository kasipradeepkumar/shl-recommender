import {AssessmentRecommendations} from '@/components/AssessmentRecommendations';
import {NeedsIdentificationForm} from '@/components/NeedsIdentificationForm';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-12 bg-background">
      <Card className="w-full max-w-2xl shadow-md rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">SHL Assessment Recommender</CardTitle>
          <CardDescription>
            Answer a few questions to get personalized assessment recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NeedsIdentificationForm />
          <AssessmentRecommendations />
        </CardContent>
      </Card>
    </div>
  );
}
