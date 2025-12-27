import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, Award, Clock, Trophy, Zap, Star, Target } from 'lucide-react';

const AttentionWallet = () => {
  const [tokens, setTokens] = useState(100);
  const [earnedToday, setEarnedToday] = useState(0);
  const [spentToday, setSpentToday] = useState(0);
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [duration, setDuration] = useState(0);
  const [streak, setStreak] = useState(3);
  const [level, setLevel] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationText, setCelebrationText] = useState('');

  const appCosts = {
    'YouTube/Reels': 5,
    'Instagram': 4,
    'Games': 3,
    'Learning Apps': 1
  };

  const earnActivities = [
    { name: 'Reading', emoji: '👧📖', tokens: 10, color: 'from-blue-400 to-blue-600', glow: 'shadow-blue-300' },
    { name: 'Exercise', emoji: '🤸‍♂️', tokens: 15, color: 'from-green-400 to-green-600', glow: 'shadow-green-300' },
    { name: 'Homework', emoji: '✍️📚', tokens: 20, color: 'from-purple-400 to-purple-600', glow: 'shadow-purple-300' },
    { name: 'Family Time', emoji: '👨‍👩‍👧‍👦', tokens: 12, color: 'from-pink-400 to-pink-600', glow: 'shadow-pink-300' }
  ];

  const achievements = [
    { name: 'First Earn', unlocked: earnedToday > 0, icon: Star },
    { name: '3 Day Streak', unlocked: streak >= 3, icon: Zap },
    { name: 'Token Saver', unlocked: tokens >= 150, icon: Trophy },
    { name: 'Level 5', unlocked: level >= 5, icon: Target }
  ];

  useEffect(() => {
    const totalEarned = earnedToday + spentToday;
    const newLevel = Math.floor(totalEarned / 50) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      triggerCelebration(`🎉 Level ${newLevel} Unlocked!`);
    }
  }, [earnedToday, spentToday, level]);

  const triggerCelebration = (text) => {
    setCelebrationText(text);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
  };

  const addActivity = (activityName, tokensChange, type) => {
    const newActivity = {
      id: Date.now(),
      name: activityName,
      tokens: tokensChange,
      type: type,
      time: new Date().toLocaleTimeString()
    };
    setActivities([newActivity, ...activities]);
  };

  const earnTokens = (activity) => {
    const bonusTokens = streak >= 7 ? Math.floor(activity.tokens * 0.5) : 0;
    const totalTokens = activity.tokens + bonusTokens;
    
    setTokens(tokens + totalTokens);
    setEarnedToday(earnedToday + totalTokens);
    addActivity(activity.name + (bonusTokens > 0 ? ` +${bonusTokens} bonus!` : ''), totalTokens, 'earn');
    triggerCelebration(`+${totalTokens} tokens! 🎊`);
  };

  const spendTokens = () => {
    if (!selectedActivity || duration <= 0) return;
    
    const cost = appCosts[selectedActivity] * duration;
    if (tokens >= cost) {
      setTokens(tokens - cost);
      setSpentToday(spentToday + cost);
      addActivity(`${selectedActivity} (${duration} min)`, cost, 'spend');
      setSelectedActivity('');
      setDuration(0);
    } else {
      triggerCelebration('❌ Not enough tokens!');
    }
  };

  const getAppStats = () => {
    const stats = {};
    activities.forEach(activity => {
      if (activity.type === 'spend') {
        const appName = activity.name.split(' (')[0];
        stats[appName] = (stats[appName] || 0) + activity.tokens;
      }
    });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]);
  };

  const topApp = getAppStats()[0];
  const progressToNextLevel = ((earnedToday + spentToday) % 50) / 50 * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white text-gray-900 px-8 py-6 rounded-3xl shadow-2xl text-3xl font-bold animate-bounce">
            {celebrationText}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-2xl shadow-lg">
                <Wallet className="text-white" size={36} />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Attention Wallet
                </h1>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  Level {level} <Trophy size={14} className="text-yellow-500" /> | {streak} day streak 🔥
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Your Balance</p>
              <p className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {tokens}
              </p>
              <p className="text-xs text-gray-500">tokens</p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress to Level {level + 1}</span>
              <span>{Math.floor(progressToNextLevel)}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out shadow-lg"
                style={{width: `${progressToNextLevel}%`}}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-4 text-white shadow-lg transform hover:scale-105 transition-transform">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} />
                <span className="text-sm font-semibold">Earned Today</span>
              </div>
              <p className="text-3xl font-bold">{earnedToday}</p>
            </div>
            <div className="bg-gradient-to-br from-red-400 to-rose-500 rounded-2xl p-4 text-white shadow-lg transform hover:scale-105 transition-transform">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown size={20} />
                <span className="text-sm font-semibold">Spent Today</span>
              </div>
              <p className="text-3xl font-bold">{spentToday}</p>
            </div>
          </div>

          {topApp && (
            <div className="mt-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl p-4 text-white shadow-lg animate-pulse">
              <p className="text-sm mb-1 flex items-center gap-2">
                <Zap size={16} /> Attention Thief Alert!
              </p>
              <p className="text-xl font-bold">{topApp[0]}</p>
              <p className="text-sm opacity-90">Stole {topApp[1]} tokens today!</p>
            </div>
          )}
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 mb-6 border border-white/20">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Trophy className="text-yellow-500" size={24} />
            Achievements
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.name}
                className={`${achievement.unlocked ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gray-300'} rounded-xl p-3 text-center transition-all transform hover:scale-110 ${achievement.unlocked ? 'shadow-lg' : ''}`}
              >
                <achievement.icon className={`mx-auto mb-1 ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`} size={24} />
                <p className={`text-xs font-semibold ${achievement.unlocked ? 'text-white' : 'text-gray-600'}`}>
                  {achievement.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 mb-6 border border-white/20">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Award className="text-yellow-500" size={24} />
            Earn Tokens
            {streak >= 7 && <span className="text-sm text-green-600 font-normal">(+50% bonus! 🔥)</span>}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {earnActivities.map((activity) => (
              <button
                key={activity.name}
                onClick={() => earnTokens(activity)}
                className={`bg-gradient-to-br ${activity.color} text-white rounded-2xl p-4 hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 ${activity.glow} shadow-lg`}
              >
                <div className="text-5xl mb-2">{activity.emoji}</div>
                <p className="font-semibold text-lg">{activity.name}</p>
                <p className="text-sm opacity-90">+{activity.tokens} tokens</p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 mb-6 border border-white/20">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="text-red-500" size={24} />
            Use App (Spend Tokens)
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select App</label>
              <select
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none bg-white transition-all"
              >
                <option value="">Choose an app...</option>
                {Object.entries(appCosts).map(([app, cost]) => (
                  <option key={app} value={app}>{app} - {cost} tokens/min</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (minutes)</label>
              <input
                type="number"
                value={duration || ''}
                onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                min="0"
                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-all"
                placeholder="How many minutes?"
              />
            </div>
            {selectedActivity && duration > 0 && (
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 border-2 border-yellow-300 animate-pulse">
                <p className="text-sm text-gray-700">This will cost you:</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {appCosts[selectedActivity] * duration} tokens
                </p>
              </div>
            )}
            <button
              onClick={spendTokens}
              disabled={!selectedActivity || duration <= 0}
              className="w-full bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white font-bold py-4 rounded-2xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              Spend Tokens & Use App
            </button>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Activity</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {activities.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No activities yet. Start earning tokens!</p>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                  activity.type === 'earn' ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 'bg-gradient-to-r from-red-50 to-rose-50'
                }`}>
                  <div>
                    <p className="font-semibold text-gray-800">{activity.name}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <p className={`font-bold text-2xl ${
                    activity.type === 'earn' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {activity.type === 'earn' ? '+' : '-'}{activity.tokens}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {tokens < 50 && (
          <div className="mt-6 bg-gradient-to-r from-red-500 to-pink-500 border-2 border-red-300 rounded-2xl p-6 animate-pulse shadow-2xl">
            <p className="text-white font-bold text-center text-xl">
              ⚠️ "If I waste my attention, I lose my tokens." ⚠️
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttentionWallet;
