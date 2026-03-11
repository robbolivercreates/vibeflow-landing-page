const fs = require('fs');
const file = './page.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `                        </motion.div>
                </div>
            </motion.div>
        </div>
            </section >`;

const replacement = `                        </motion.div>
                    </motion.div>
                </div>
            </section>`;

if(content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content);
    console.log("Fixed JSX successfully.");
} else {
    console.log("Target not found!");
}
