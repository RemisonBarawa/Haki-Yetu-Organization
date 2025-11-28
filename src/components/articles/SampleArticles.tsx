
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const SampleArticles = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const sampleArticles = [
    {
      title: "THE PRIVATE INVESTOR MUST REVEAL ALL THE DETAILS OF HIS TPS PROPOSAL",
      slug: "private-investor-must-reveal-tps-proposal-details",
      excerpt: "Transparency concerns regarding the TPS proposal from private investors.",
      content: "The private investor must reveal all the details of his TPS proposal to ensure transparency and accountability in the process.",
      category: "Press Statements",
      thematic_area: "Land and Housing",
      status: "published",
      published_at: new Date("2023-10-18").toISOString(),
      featured_image: null
    },
    {
      title: "THE PROPAGANDA AROUND BUXTON HOUSING PROJECT",
      slug: "propaganda-around-buxton-housing-project",
      excerpt: "Examining the misinformation surrounding the Buxton Housing Project.",
      content: "The propaganda around Buxton Housing Project needs to be addressed to provide clarity to the public about the real situation.",
      category: "Press Statements",
      thematic_area: "Land and Housing",
      status: "published",
      published_at: new Date("2023-08-30").toISOString(),
      featured_image: null
    },
    {
      title: "Disciplinary Action or Cover UP? – Shakahola Massacre",
      slug: "disciplinary-action-or-cover-up-shakahola-massacre",
      excerpt: "Haki Yetu continues to condole with the bereaved and the survivors and loved ones of the Shakahola Massacre.",
      content: "Haki Yetu continues to condole with the bereaved and the survivors and loved ones of the Shakahola Massacre. The organization questions whether recent actions constitute genuine disciplinary measures or attempts to cover up the truth.",
      category: "Press Statements",
      thematic_area: "Governance and Accountability",
      status: "published",
      published_at: new Date("2023-05-03").toISOString(),
      featured_image: null
    },
    {
      title: "Housing for who?: Buxton Estate 2 years on",
      slug: "housing-for-who-buxton-estate-2-years-on",
      excerpt: "The Buxton Housing project does not and will not address the housing crisis in Mombasa County.",
      content: "The Buxton Housing project does not and will not address the housing crisis in Mombasa County. Two years after its inception, questions remain about who this project truly serves.",
      category: "Press Statements",
      thematic_area: "Land and Housing",
      status: "published",
      published_at: new Date("2023-03-07").toISOString(),
      featured_image: null
    },
    {
      title: "THE DEAD HAVE RIGHTS TOO",
      slug: "the-dead-have-rights-too",
      excerpt: "Public outcry following the decision to construct toilets on a public cemetery.",
      content: "The attention of Haki Yetu Organization has been drawn to the public outcry following the decision of the former County government of Mombasa in constructing toilets on a public cemetery as part of corporate social responsibility for the world bank project of upgrading fresh water supply through Mombasa Water Supply and Sanitation Company (MOWASCO).",
      category: "Press Statements",
      thematic_area: "Governance and Accountability",
      status: "published",
      published_at: new Date("2022-09-06").toISOString(),
      featured_image: null
    },
    {
      title: "Commemorating World Elderly Abuse Awareness Day",
      slug: "commemorating-world-elderly-abuse-awareness-day",
      excerpt: "Haki Yetu Organisation joins the world in commemorating World Elder Abuse Awareness Day.",
      content: "Haki Yetu Organisation is joining the world in commemorating World Elder Abuse Awareness Day (WEAAD) which is held each year on 15 June to highlight one of the worst manifestations of ageism and inequality in our society, elder abuse. Elder abuse is any act which causes harm to an older person and is carried out by someone they know and trust such as a family member or friend.",
      category: "Press Statements",
      thematic_area: "Cohesion and Transformation",
      status: "published",
      published_at: new Date("2022-06-15").toISOString(),
      featured_image: null
    },
    {
      title: "A call to reject leaders of questionable integrity",
      slug: "call-to-reject-leaders-questionable-integrity",
      excerpt: "Haki Yetu joins the country in mourning the death of the third president while calling for integrity in leadership.",
      content: "Haki Yetu, Inform-Action and the Angaza Movement in general joins the rest of the country in mourning the death of the third president of the Republic, HE Mwai Kibaki. While his failures are well documented, the late president has in many ways performed better than his predecessors and successor. May his soul rest in eternal peace.",
      category: "Press Statements",
      thematic_area: "Governance and Accountability",
      status: "published",
      published_at: new Date("2022-04-28").toISOString(),
      featured_image: null
    },
    {
      title: "Stop the Violence! Haki Yetu calls for action against Shabal and Nassir",
      slug: "stop-violence-haki-yetu-calls-action-shabal-nassir",
      excerpt: "Condemnation of frequent incidences of violence in Mombasa involving supporters of gubernatorial aspirants.",
      content: "Haki Yetu Organization wishes to express its outrage and condemnation at the frequent incidences of violence witnessed in Mombasa, involving supporters of two gubernatorial aspirants namely Suleiman Shabhal and Abdulswamad Sharrif Nassir.",
      category: "Press Statements",
      thematic_area: "Governance and Accountability",
      status: "published",
      published_at: new Date("2022-03-10").toISOString(),
      featured_image: null
    },
    {
      title: "Government must respect freedom of expression – A statement by Angaza Movement",
      slug: "government-must-respect-freedom-expression-angaza-movement",
      excerpt: "Government must respect freedom of expression, abandon targeting voice of critical mass.",
      content: "Government must respect freedom of expression, abandon targeting voice of critical mass. On Sunday, January 30, 2022, an individual who identified himself as a police officer working at the Coast regional commander's office, by the name Njiru, summoned Khelef Khalifa to the Coast Police headquarters.",
      category: "Press Statements",
      thematic_area: "Governance and Accountability",
      status: "published",
      published_at: new Date("2022-01-31").toISOString(),
      featured_image: null
    },
    {
      title: "A statement by Lamu inter-religious leaders on the state of security in the county",
      slug: "statement-lamu-inter-religious-leaders-security-county",
      excerpt: "Religious leaders from Lamu County address recent violent attacks and displacement of communities.",
      content: "We the religious leaders from Lamu County have congregated here today to address the events that have been experienced in the county in the past one month. We express our condolences and deepest sympathies to the victims and families of the recent violent and reckless attacks. We wish to express our solidarity too with the families and communities that were forced to leave their homesteads and take refuge as IDPs in schools and community centers.",
      category: "Press Statements",
      thematic_area: "Governance and Accountability",
      status: "published",
      published_at: new Date("2022-01-18").toISOString(),
      featured_image: null
    }
  ];

  const createSampleArticles = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to create articles');
      }

      // Check if articles already exist
      const { data: existingArticles } = await supabase
        .from('articles')
        .select('slug')
        .in('slug', sampleArticles.map(article => article.slug));

      // Filter out articles that already exist
      const articlesToCreate = sampleArticles.filter(
        article => !existingArticles?.some(existing => existing.slug === article.slug)
      );

      if (articlesToCreate.length === 0) {
        throw new Error('All sample articles already exist');
      }

      // Add author_id to each article
      const articlesWithAuthor = articlesToCreate.map(article => ({
        ...article,
        author_id: user.id
      }));

      const { data, error } = await supabase
        .from('articles')
        .insert(articlesWithAuthor)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `${data.length} sample articles created successfully`
      });
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      setIsLoading(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create sample articles",
        variant: "destructive"
      });
      setIsLoading(false);
      console.error('Error creating sample articles:', error);
    }
  });

  return (
    <Button 
      onClick={() => createSampleArticles.mutate()}
      disabled={isLoading}
      variant="outline"
      className="flex items-center gap-2"
    >
      <Plus className="h-4 w-4" />
      {isLoading ? 'Creating...' : 'Add Sample Articles'}
    </Button>
  );
};

export default SampleArticles;
