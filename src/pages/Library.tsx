import { motion } from 'framer-motion';
import { useState } from 'react';
import Layout from '@/components/Layout';
import GlassPanel from '@/components/GlassPanel';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, Bookmark } from 'lucide-react';

const articles = [
  { id: 1, title: 'Understanding Orbital Velocity', category: 'Physics', readTime: '5 min', bookmarked: true },
  { id: 2, title: 'History of Space Stations', category: 'History', readTime: '8 min', bookmarked: false },
  { id: 3, title: 'Satellite Communication Protocols', category: 'Engineering', readTime: '12 min', bookmarked: true },
  { id: 4, title: 'The Apollo Missions', category: 'Missions', readTime: '15 min', bookmarked: false },
  { id: 5, title: 'Rocket Propulsion Systems', category: 'Engineering', readTime: '10 min', bookmarked: false },
  { id: 6, title: 'Mars Exploration Timeline', category: 'Missions', readTime: '7 min', bookmarked: false },
];

const Library = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Physics', 'Engineering', 'History', 'Missions'];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || article.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <motion.div
        className="p-8 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Space Knowledge Base</h1>
            <p className="text-muted-foreground">Collection of AI-generated and curated lessons</p>
          </div>

          {/* Search and Filters */}
          <GlassPanel>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-background/50"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <Badge
                    key={cat}
                    variant={filter === cat ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setFilter(cat)}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
          </GlassPanel>

          {/* Articles Grid */}
          <div className="space-y-4">
            {filteredArticles.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassPanel className="hover:border-accent/50 cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{article.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Badge variant="outline">{article.category}</Badge>
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                    </div>
                    <button className={`p-2 rounded-lg ${article.bookmarked ? 'text-accent' : 'text-muted-foreground'} hover:bg-accent/10`}>
                      <Bookmark className={`w-5 h-5 ${article.bookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Library;
