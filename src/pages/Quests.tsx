import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { QuestList } from '@/components/quests/QuestList';
import { useQuests } from '@/contexts/QuestContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

const Quests: React.FC = () => {
  const { activeQuests, availableQuests, completedQuests, isLoading } = useQuests();
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Filter quests based on search, difficulty, and category
  const filterQuests = (quests: any[]) => {
    return quests.filter(quest => {
      const matchesSearch = quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          quest.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDifficulty = difficultyFilter === "all" || quest.difficulty === difficultyFilter;
      
      const matchesCategory = categoryFilter === "all" || quest.category === categoryFilter;
      
      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  };

  const filteredActiveQuests = filterQuests(activeQuests);
  const filteredAvailableQuests = filterQuests(availableQuests);
  const filteredCompletedQuests = filterQuests(completedQuests);

  // Get unique categories from quests
  const categories = Array.from(new Set(activeQuests.map(quest => quest.category)));
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-bold mb-2">Quests</h1>
              <p className="text-muted-foreground">
                Complete quests to earn rewards and level up your blockchain knowledge
              </p>
            </div>
            
            <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search quests..."
                  className="pl-10 w-full md:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-full md:w-36">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-36">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs defaultValue="available" className="mb-10">
            <TabsList className="mb-8">
              <TabsTrigger value="all">
                All Quests ({filteredActiveQuests.length})
              </TabsTrigger>
              <TabsTrigger value="available">
                Available ({filteredAvailableQuests.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({filteredCompletedQuests.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <QuestList 
                quests={filteredActiveQuests} 
                isLoading={isLoading}
                emptyMessage="No quests found matching your filters"
              />
            </TabsContent>
            
            <TabsContent value="available">
              <QuestList 
                quests={filteredAvailableQuests} 
                isLoading={isLoading}
                emptyMessage="No available quests found matching your filters"
              />
            </TabsContent>
            
            <TabsContent value="completed">
              <QuestList 
                quests={filteredCompletedQuests} 
                isLoading={isLoading}
                emptyMessage="You haven't completed any quests yet"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Quests;
