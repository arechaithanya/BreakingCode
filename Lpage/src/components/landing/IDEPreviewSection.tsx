import React from 'react';
import { motion } from 'framer-motion';
import { Play, Shield, Zap, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import breakingCodeLogo from '../../assets/breaking-code-logo.jpeg';

const IDEPreviewSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="ide-preview" className="snap-section flex flex-col items-center justify-center bg-devmind-dark px-6 py-20">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            The power of a <br />
            <span className="text-devmind-purple">Supercomputer</span> in your tab.
          </h2>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            Stop worrying about local environments. Write, compile, and debug in over 50 languages with zero latency. Our distributed backend ensures your code runs at peak performance.
          </p>

          <div className="mb-8 inline-flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
            <img
              src={breakingCodeLogo}
              alt="Breaking Code logo"
              className="h-12 w-auto rounded-md object-contain"
            />
            <div className="text-left">
              <div className="text-xs uppercase tracking-[0.25em] text-devmind-cyan">Brand Signal</div>
              <div className="text-sm text-gray-300">Breaking Code powers every compile, preview, and deploy flow.</div>
            </div>
          </div>
          
          <div className="space-y-4 mb-10">
            {[
              { icon: <Zap className="w-5 h-5 text-devmind-cyan" />, text: "Instant execution with isolated containers" },
              { icon: <Shield className="w-5 h-5 text-devmind-purple" />, text: "Secure sandboxing for all languages" },
              { icon: <Terminal className="w-5 h-5 text-gray-400" />, text: "Interactive terminal with custom I/O" },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5">{feature.icon}</div>
                <span className="text-gray-300 font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/ide')}
            className="group relative px-8 py-4 bg-devmind-purple rounded-xl font-bold overflow-hidden transition-all hover:pr-12"
          >
            <span className="relative z-10 flex items-center gap-2">
              Try Breaking Code IDE <Play className="w-4 h-4 fill-current" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
          </button>
        </motion.div>

        {/* Right Side: Mock IDE */}
        <motion.div
          initial={{ opacity: 0, x: 50, rotateY: -10 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-devmind-cyan/20 blur-[100px] -z-10" />
          
          <div className="react-bits-card overflow-hidden">
            {/* Window header */}
            <div className="bg-white/5 px-4 py-3 flex items-center justify-between border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono tracking-widest uppercase">
                <img
                  src={breakingCodeLogo}
                  alt="Breaking Code logo"
                  className="h-5 w-5 rounded-sm object-cover"
                />
                <span>main.py — Breaking Code</span>
              </div>
              <div className="w-10" />
            </div>
            
            {/* Editor content */}
            <div className="p-6 font-mono text-xs md:text-sm leading-relaxed overflow-hidden">
              <div className="flex gap-4">
                <div className="text-gray-600 select-none text-right w-4">
                  1<br/>2<br/>3<br/>4<br/>5<br/>6<br/>7<br/>8<br/>9<br/>10<br/>11<br/>12<br/>13<br/>14<br/>15<br/>16<br/>17<br/>18<br/>19<br/>20
                </div>
                <div className="text-gray-300">
                  <span className="text-devmind-purple">import</span> heapq<br /><br />
                  <span className="text-devmind-purple">def</span> <span className="text-yellow-400">dijkstra</span>(n, graph, src):<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;dist = [<span className="text-devmind-cyan">float</span>(<span className="text-green-400">'inf'</span>)] * n<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;dist[src] = <span className="text-orange-400">0</span><br />
                  &nbsp;&nbsp;&nbsp;&nbsp;pq = [(<span className="text-orange-400">0</span>, src)]<br /><br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-devmind-purple">while</span> pq:<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;curr_dist, node = heapq.<span className="text-yellow-400">heappop</span>(pq)<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-devmind-purple">if</span> curr_dist &gt; dist[node]:<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-devmind-purple">continue</span><br /><br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-devmind-purple">for</span> neighbor, weight <span className="text-devmind-purple">in</span> graph[node]:<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;new_dist = curr_dist + weight<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-devmind-purple">if</span> new_dist &lt; dist[neighbor]:<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dist[neighbor] = new_dist<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;heapq.<span className="text-yellow-400">heappush</span>(pq, (new_dist, neighbor))<br /><br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-devmind-purple">return</span> dist
                </div>
              </div>
              
              {/* Output area */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 pt-4 border-t border-white/5"
              >
                <div className="text-[10px] text-gray-600 mb-2 uppercase tracking-widest">Output</div>
                <div className="text-gray-400 text-xs leading-tight">
                  <span className="text-green-400">$</span> Node 0: Distance = 0, Path = 0<br/>
                  <span className="text-green-400">$</span> Node 1: Distance = 2, Path = 0 -&gt; 1<br/>
                  <span className="text-green-400">$</span> Node 2: Distance = 3, Path = 0 -&gt; 1 -&gt; 2<br/>
                  <span className="text-green-400">$</span> Node 3: Distance = 9, Path = 0 -&gt; 1 -&gt; 3<br/>
                  <span className="text-green-400">$</span> Node 4: Distance = 6, Path = 0 -&gt; 1 -&gt; 2 -&gt; 4<br/>
                </div>
                <div className="text-gray-500 mt-2 text-[10px]">$ Program exited with status: 0</div>
              </motion.div>
            </div>
          </div>

          {/* Floating badge */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -bottom-6 -right-6 glass p-4 rounded-xl shadow-xl flex items-center gap-3 border-devmind-cyan/20"
          >
            <div className="w-10 h-10 rounded-lg bg-devmind-cyan/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-devmind-cyan" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Safe Sandbox</div>
              <div className="text-[10px] text-gray-500">AES-256 Encrypted</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default IDEPreviewSection;
