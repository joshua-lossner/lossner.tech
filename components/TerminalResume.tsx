'use client'

import React, { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'

interface TerminalLine {
  text: string
  type?: 'normal' | 'error' | 'processing' | 'separator' | 'user-input' | 'markdown' | 'ascii-art' | 'tagline' | 'ai-response' | 'menu-header'
  isMarkdown?: boolean
  clickableCommand?: string
}

const TerminalResume = () => {
  const [currentInput, setCurrentInput] = useState('')
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentMenu, setCurrentMenu] = useState('main')
  const [previousMenu, setPreviousMenu] = useState('main')
  const [systemReady, setSystemReady] = useState(false)
  const [isDisplayingContent, setIsDisplayingContent] = useState(false)
  const [currentDirectory, setCurrentDirectory] = useState('')
  const [directoryFiles, setDirectoryFiles] = useState<any[]>([])
  const [isLoadingContent, setIsLoadingContent] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [needsInputDivider, setNeedsInputDivider] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const hiddenInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Taglines for cycling effect
  const taglines = [
    'SOFTWARE ENGINEER | SYSTEM ARCHITECT | TECH INNOVATOR',
    'BUILDING THE FUTURE, ONE COMMIT AT A TIME',
    'CRAFTING ELEGANT SOLUTIONS TO COMPLEX PROBLEMS',
    'TURNING IDEAS INTO SCALABLE REALITY'
  ]
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0)
  const [isGlitching, setIsGlitching] = useState(false)
  const [version, setVersion] = useState('v1.0.0')

  // Get version from package.json
  useEffect(() => {
    fetch('/package.json')
      .then(response => response.json())
      .then(data => setVersion(`v${data.version}`))
      .catch(() => setVersion('v1.0.0'))
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current && !isDisplayingContent) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalLines, isDisplayingContent, currentInput])

  // Focus management
  useEffect(() => {
    if (systemReady && hiddenInputRef.current) {
      hiddenInputRef.current.focus()
    }
  }, [systemReady])

  // Tagline cycling effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true)
      setTimeout(() => {
        setCurrentTaglineIndex(prev => (prev + 1) % taglines.length)
        setIsGlitching(false)
      }, 300)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [taglines.length])

  // Initial boot sequence
  useEffect(() => {
    const bootSequence = async () => {
      await addLine('INITIALIZING TERMINAL INTERFACE...', 'processing')
      await new Promise(resolve => setTimeout(resolve, 500))
      await addLine('AI ASSISTANT "ALEX" LOADED AND READY', 'processing')
      await new Promise(resolve => setTimeout(resolve, 300))
      showMainMenu()
      setSystemReady(true)
    }

    bootSequence()
  }, [])

  const addLine = async (text: string, type?: TerminalLine['type'], isMarkdown?: boolean, clickableCommand?: string) => {
    return new Promise<void>((resolve) => {
      setTerminalLines(prev => [...prev, { text, type, isMarkdown, clickableCommand }])
      setTimeout(resolve, 50)
    })
  }

  const createBorder = (title?: string, char: string = '━'): string => {
    const totalChars = 70
    
    if (!title) {
      return char.repeat(totalChars)
    }
    
    const titleWithSpaces = ` ${title} `
    const remainingChars = totalChars - titleWithSpaces.length
    const leftPadding = Math.floor(remainingChars / 2)
    const rightPadding = remainingChars - leftPadding
    
    return char.repeat(leftPadding) + titleWithSpaces + char.repeat(rightPadding)
  }

  const showBanner = async () => {
    await addLine('')
    await addLine(createBorder('', '═'), 'separator')
    await addLine('')
    await addLine(`
██╗      ██████╗ ███████╗███████╗███╗   ██╗███████╗██████╗ 
██║     ██╔═══██╗██╔════╝██╔════╝████╗  ██║██╔════╝██╔══██╗
██║     ██║   ██║███████╗███████╗██╔██╗ ██║█████╗  ██████╔╝
██║     ██║   ██║╚════██║╚════██║██║╚██╗██║██╔══╝  ██╔══██╗
███████╗╚██████╔╝███████║███████║██║ ╚████║███████╗██║  ██║
╚══════╝ ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝`, 'ascii-art')
    await addLine('')
    await addLine('TAGLINE_PLACEHOLDER', 'tagline')
    await addLine('')
    await addLine(createBorder('', '═'), 'separator')
    await addLine('')
  }

  const showMainMenu = async () => {
    setTerminalLines([])
    setIsDisplayingContent(false)
    setCurrentMenu('main')
    setCurrentDirectory('')
    setNeedsInputDivider(true)
    await showBanner()
    await addLine(createBorder('MAIN MENU'), 'normal')
    await addLine('')
    await addLine('1. Experience - Professional work history', 'normal', false, '1')
    await addLine('2. Skills - Technical expertise & proficiencies', 'normal', false, '2')
    await addLine('3. Projects - Notable work & contributions', 'normal', false, '3')
    await addLine('4. Education - Academic background & certifications', 'normal', false, '4')
    await addLine('5. Journal - Thoughts on tech and career', 'normal', false, '5')
    await addLine('6. About - Personal introduction', 'normal', false, '6')
    await addLine('')
    await addLine(createBorder(), 'normal')
    await addLine('')
    await addLine('Type a number above, "help" for commands, or ask Alex a question.', 'processing')
    await addLine('')
  }

  const showHelp = async () => {
    setTerminalLines([])
    setNeedsInputDivider(false)
    await showBanner()
    await addLine(createBorder('AVAILABLE COMMANDS'), 'normal')
    await addLine('')
    await addLine('/menu     - Return to main menu', 'normal')
    await addLine('/help     - Display available commands', 'normal')
    await addLine('/contact  - View contact information', 'normal')
    await addLine('/download - Download resume as PDF', 'normal')
    await addLine('/github   - Visit GitHub profile', 'normal')
    await addLine('/linkedin - Visit LinkedIn profile', 'normal')
    await addLine('/voice    - Toggle audio output for Alex responses', 'normal')
    await addLine('/clear    - Clear terminal screen', 'normal')
    await addLine('')
    await addLine(createBorder('AI ASSISTANT'), 'normal')
    await addLine('')
    await addLine('Ask Alex anything about:', 'processing')
    await addLine('• Career advice and tech industry insights', 'normal')
    await addLine('• Programming and system architecture', 'normal')
    await addLine('• Joshua\'s experience and background', 'normal')
    await addLine('• Project ideas and learning paths', 'normal')
    await addLine('')
    await addLine('Just type your question naturally!', 'processing')
    await addLine('')
    await addLine(createBorder(), 'separator')
    await addLine('')
    await addLine('Type commands, menu numbers, or ask Alex a question.', 'processing')
    await addLine('')
  }

  const showAbout = async () => {
    setTerminalLines([])
    setIsDisplayingContent(true)
    setNeedsInputDivider(false)
    await showBanner()
    await addLine(createBorder('ABOUT'), 'normal')
    await addLine('')
    const content = `
# About Joshua Lossner

Senior Software Engineer with 10+ years of experience building scalable systems and leading technical teams. 
Passionate about clean code, system architecture, and creating elegant solutions to complex problems.

## Core Competencies
- Full-stack development with modern frameworks
- Cloud architecture and DevOps practices
- Team leadership and mentorship
- Open source contribution

## What I Do
I specialize in building distributed systems that scale. Whether it's architecting microservices, optimizing database performance, or implementing real-time data pipelines, I focus on creating robust solutions that stand the test of time.

## Philosophy
I believe in writing code that humans can understand, systems that operators can reason about, and documentation that actually helps. The best technology decisions are the ones that balance innovation with pragmatism.

Currently focused on distributed systems, AI/ML integration, and building developer tools that improve productivity.
`
    await addLine(content, 'markdown', true)
    await addLine('')
    await addLine(createBorder(), 'separator')
    await addLine('')
    await addLine('Type /menu to return to main menu.', 'processing')
    await addLine('')
  }

  const showExperience = async () => {
    setTerminalLines([])
    setIsDisplayingContent(true)
    setNeedsInputDivider(false)
    await showBanner()
    await addLine(createBorder('PROFESSIONAL EXPERIENCE'), 'menu-header')
    await addLine('')
    
    const experiences = [
      {
        title: '## Senior Software Engineer',
        company: 'Tech Innovations Inc.',
        period: '2021 - Present',
        description: `
- Lead architect for microservices migration serving 5M+ users
- Reduced system latency by 40% through optimization and caching strategies
- Mentored team of 8 engineers on best practices and code reviews
- Implemented observability stack with OpenTelemetry reducing MTTR by 60%

**Technologies:** Node.js, React, AWS, Kubernetes, GraphQL, Redis`
      },
      {
        title: '## Software Engineer',
        company: 'Digital Solutions Corp',
        period: '2018 - 2021',
        description: `
- Built real-time analytics platform processing 1B+ events daily
- Implemented CI/CD pipelines reducing deployment time by 60%
- Led frontend modernization from jQuery to React
- Designed and implemented RESTful APIs serving mobile applications

**Technologies:** Python, TypeScript, Docker, PostgreSQL, Kafka`
      },
      {
        title: '## Junior Developer',
        company: 'StartupXYZ',
        period: '2015 - 2018',
        description: `
- Developed core features for SaaS platform with 10k+ users
- Improved test coverage from 20% to 85%
- Participated in architecture decisions and sprint planning
- Built automated reporting system saving 20 hours/week

**Technologies:** Ruby on Rails, JavaScript, MySQL, Redis`
      }
    ]

    // Sort experiences by most recent start date
    const parseStartDate = (exp: any): number => {
      if (exp.start) {
        const ts = Date.parse(exp.start)
        if (!isNaN(ts)) return ts
        const m = exp.start.match(/\d{4}/)
        if (m) return parseInt(m[0])
      }

      const parts = (exp.period || '').split('-').map((p: string) => p.trim())
      const start = parts[0]
      const match = start.match(/\d{4}/)
      return match ? parseInt(match[0]) : 0
    }

    experiences.sort((a, b) => parseStartDate(b) - parseStartDate(a))
    
    for (const exp of experiences) {
      await addLine(exp.title, 'markdown', true)
      await addLine(`**${exp.company}** | ${exp.period}`, 'markdown', true)
      await addLine(exp.description, 'markdown', true)
      await addLine('')
    }
    
    await addLine(createBorder(), 'separator')
    await addLine('')
    await addLine('Type /menu to return to main menu.', 'processing')
    await addLine('')
  }

  const showSkills = async () => {
    setTerminalLines([])
    setIsDisplayingContent(true)
    setNeedsInputDivider(false)
    await showBanner()
    await addLine(createBorder('TECHNICAL SKILLS'), 'menu-header')
    await addLine('')
    
    const content = `
## Languages
**Expert:** TypeScript, JavaScript, Python  
**Advanced:** Go, Java, SQL  
**Intermediate:** Rust, C++

## Frontend
**Frameworks:** React, Next.js, Vue, Angular  
**Styling:** Tailwind CSS, Styled Components, SASS  
**State Management:** Redux, Zustand, Context API  
**Testing:** Jest, React Testing Library, Cypress

## Backend
**Node.js:** Express, NestJS, Fastify  
**Python:** Django, FastAPI, Flask  
**APIs:** REST, GraphQL, gRPC, WebSockets  
**Message Queues:** RabbitMQ, Kafka, Redis Pub/Sub

## Databases
**SQL:** PostgreSQL, MySQL, SQLite  
**NoSQL:** MongoDB, DynamoDB, Cassandra  
**Cache:** Redis, Memcached  
**Search:** Elasticsearch, OpenSearch

## Cloud & DevOps
**AWS:** EC2, S3, Lambda, RDS, ECS, CloudFormation  
**Containers:** Docker, Kubernetes, Helm  
**CI/CD:** GitHub Actions, GitLab CI, Jenkins  
**IaC:** Terraform, Pulumi, CDK

## Architecture & Practices
- Microservices & Event-Driven Architecture
- Domain-Driven Design (DDD)
- Test-Driven Development (TDD)
- Agile/Scrum Methodologies
- Performance Optimization & Monitoring
`
    await addLine(content, 'markdown', true)
    await addLine('')
    await addLine(createBorder(), 'separator')
    await addLine('')
    await addLine('Type /menu to return to main menu.', 'processing')
    await addLine('')
  }

  const showProjects = async () => {
    setTerminalLines([])
    setIsDisplayingContent(true)
    setNeedsInputDivider(false)
    await showBanner()
    await addLine(createBorder('NOTABLE PROJECTS'), 'menu-header')
    await addLine('')
    
    const content = `
## DevFlow CLI
**Open Source Developer Tool** | 10k+ GitHub Stars

A command-line tool that automates common development workflows and integrates with popular development tools. Built with Go and designed for maximum performance and extensibility.

- Reduced developer context switching by 40%
- Integrated with 15+ popular development tools
- Active community with 100+ contributors
- **Tech:** Go, Cobra, SQLite, GitHub API

---

## CloudMart E-commerce Platform
**Scalable Marketplace** | $50M+ Transactions

Enterprise e-commerce platform handling high-volume transactions with real-time inventory management and fraud detection.

- Achieved 99.9% uptime over 2 years
- Handled Black Friday traffic with 10x normal load
- Implemented ML-based fraud detection reducing chargebacks by 70%
- **Tech:** React, Node.js, PostgreSQL, Redis, AWS

---

## DataStream Analytics
**Real-time Data Visualization** | 100M+ Events/Day

Streaming analytics platform with customizable dashboards for Fortune 500 clients.

- Sub-second latency for real-time updates
- Custom query language for non-technical users
- White-label solution deployed for 20+ enterprises
- **Tech:** TypeScript, D3.js, WebSockets, Kafka, ClickHouse

---

## CodeAssist AI
**VS Code Extension** | 100k+ Installs

AI-powered code assistant providing intelligent code completion and refactoring suggestions.

- Context-aware suggestions improving coding speed by 30%
- Support for 10+ programming languages
- Privacy-focused with local processing option
- **Tech:** TypeScript, OpenAI API, Language Server Protocol
`
    await addLine(content, 'markdown', true)
    await addLine('')
    await addLine(createBorder(), 'separator')
    await addLine('')
    await addLine('Type /menu to return to main menu.', 'processing')
    await addLine('')
  }

  const showEducation = async () => {
    setTerminalLines([])
    setIsDisplayingContent(true)
    setNeedsInputDivider(false)
    await showBanner()
    await addLine(createBorder('EDUCATION & CERTIFICATIONS'), 'menu-header')
    await addLine('')
    
    const content = `
## Master of Science in Computer Science
**Stanford University** | 2013 - 2015 | GPA: 3.9/4.0

Focus: Distributed Systems and Machine Learning
- Research on distributed consensus algorithms published in ACM
- Teaching Assistant for CS244B: Distributed Systems
- Graduate Fellowship recipient

---

## Bachelor of Science in Computer Engineering
**UC Berkeley** | 2009 - 2013 | Magna Cum Laude

- Dean's List all semesters
- President of ACM Student Chapter
- Undergraduate Research in Robotics Lab

---

## Professional Certifications

**AWS Solutions Architect Professional** (2022)  
Amazon Web Services

**Certified Kubernetes Administrator** (2021)  
Cloud Native Computing Foundation

**Google Cloud Professional Cloud Architect** (2020)  
Google Cloud Platform
`
    await addLine(content, 'markdown', true)
    await addLine('')
    await addLine(createBorder(), 'separator')
    await addLine('')
    await addLine('Type /menu to return to main menu.', 'processing')
    await addLine('')
  }

  const showContact = async () => {
    setTerminalLines([])
    await showBanner()
    await addLine(createBorder('CONTACT INFORMATION'), 'normal')
    await addLine('')
    await addLine('Email:    joshua@lossner.tech', 'normal')
    await addLine('LinkedIn: linkedin.com/in/joshua-lossner', 'normal')
    await addLine('GitHub:   github.com/joshua-lossner', 'normal')
    await addLine('Location: San Francisco, CA', 'normal')
    await addLine('')
    await addLine('Feel free to reach out for opportunities or collaborations!', 'processing')
    await addLine('')
    await addLine(createBorder(), 'separator')
    await addLine('')
    await addLine('Type /menu to return to main menu.', 'processing')
    await addLine('')
  }

  // Fetch directory files from GitHub API
  const fetchDirectoryFiles = async (directory: string) => {
    try {
      setIsLoadingContent(true)
      const response = await fetch(`/api/content?directory=${directory}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch directory')
      }
      
      setDirectoryFiles(data.files || [])
      return data.files || []
    } catch (error) {
      console.error('Error fetching directory files:', error)
      await addLine('Error loading content. Using static data.', 'error')
      return []
    } finally {
      setIsLoadingContent(false)
    }
  }

  // Fetch specific file content
  const fetchFileContent = async (directory: string, filename: string) => {
    try {
      setIsLoadingContent(true)
      const response = await fetch(`/api/content?directory=${directory}&file=${filename}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch file')
      }
      
      return data
    } catch (error) {
      console.error('Error fetching file content:', error)
      return null
    } finally {
      setIsLoadingContent(false)
    }
  }

  // Show directory listing (like books in coherenceism.info)
  const showDirectoryListing = async (directory: string) => {
    setTerminalLines([])
    setCurrentDirectory(directory)
    setCurrentMenu('directory')
    setNeedsInputDivider(false)
    await showBanner()
    
    await addLine(createBorder(`${directory.toUpperCase()}`), 'normal')
    await addLine('')
    
    if (isLoadingContent) {
      await addLine('Loading content...', 'processing')
    } else {
      const files = await fetchDirectoryFiles(directory)
      
      if (files.length === 0) {
        await addLine('No content available.', 'processing')
      } else {
        files.forEach((file: any, index: number) => {
          const displayTitle = file.metadata?.company 
            ? `${file.title} - ${file.metadata.company}`
            : file.title
          const displayPeriod = file.metadata?.period ? ` (${file.metadata.period})` : ''
          
          addLine(`${index + 1}. ${displayTitle}${displayPeriod}`, 'normal', false, `${index + 1}`)
        })
      }
    }
    
    await addLine('')
    await addLine(createBorder(), 'separator')
    await addLine('')
    await addLine('Type a number to view content or /menu to return.', 'processing')
    await addLine('')
  }

  // Show file content (like chapter in coherenceism.info)
  const showFileContent = async (directory: string, filename: string) => {
    setTerminalLines([])
    setIsDisplayingContent(true)
    setNeedsInputDivider(false)
    
    const fileData = await fetchFileContent(directory, filename)
    
    if (!fileData) {
      await addLine('Content not available.', 'error')
      return
    }
    
    await showBanner()
    await addLine(createBorder(fileData.title.toUpperCase()), 'normal')
    await addLine('')
    
    // Add metadata if available
    if (fileData.metadata?.company) {
      await addLine(`**Company:** ${fileData.metadata.company}`, 'markdown', true)
    }
    if (fileData.metadata?.period) {
      await addLine(`**Period:** ${fileData.metadata.period}`, 'markdown', true)
    }
    if (fileData.metadata?.location) {
      await addLine(`**Location:** ${fileData.metadata.location}`, 'markdown', true)
    }
    if (Object.keys(fileData.metadata).length > 0) {
      await addLine('')
    }
    
    // Add main content
    await addLine(fileData.content, 'markdown', true)
    await addLine('')
    await addLine(createBorder(), 'separator')
    await addLine('')
    await addLine('Type /menu to return or navigate with arrow keys.', 'processing')
    await addLine('')
  }

  const callAI = async (message: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'AI request failed')
      }

      return data.response
    } catch (error: any) {
      console.error('AI call failed:', error)
      return "AI assistant temporarily offline. Please try again."
    }
  }

  const generateSpeech = async (text: string) => {
    try {
      const response = await fetch('/api/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Speech synthesis failed')
      }

      return data.audioUrl
    } catch (error: any) {
      console.error('Speech generation failed:', error)
      return null
    }
  }

  const typeAIResponse = async (text: string, enableVoice: boolean = true) => {
    await addLine('────────────────────────────────────────', 'separator')
    
    // Generate speech for AI responses if audio is enabled
    let audioUrl = null
    if (audioEnabled && enableVoice && text.length < 1000) {
      audioUrl = await generateSpeech(text)
    }
    
    const lines = text.split('\n')
    
    // Start playing audio if available
    if (audioUrl && audioRef.current) {
      setIsPlaying(true)
      audioRef.current.src = audioUrl
      audioRef.current.play().catch(console.error)
    }
    
    for (const line of lines) {
      await new Promise(resolve => setTimeout(resolve, 100))
      await addLine(`    ${line}`, 'ai-response') // 4-space indentation like coherenceism
    }
    
    await addLine('────────────────────────────────────────', 'separator')
    await new Promise(resolve => setTimeout(resolve, 200))
    await addLine('')
  }

  const processCommand = async (command: string) => {
    const cmd = command.toLowerCase().trim()
    
    // Handle numbered menu selections
    if (currentMenu === 'main' && ['1', '2', '3', '4', '5', '6'].includes(cmd)) {
      switch (cmd) {
        case '1':
          await showDirectoryListing('Experience')
          return
        case '2':
          await showDirectoryListing('Skills')
          return
        case '3':
          await showDirectoryListing('Projects')
          return
        case '4':
          await showDirectoryListing('Education')
          return
        case '5':
          await showDirectoryListing('Journal')
          return
        case '6':
          await showAbout()
          return
      }
    }
    
    // Handle numbered selections in directory listing
    if (currentMenu === 'directory' && /^\d+$/.test(cmd)) {
      const index = parseInt(cmd) - 1
      if (directoryFiles && index >= 0 && index < directoryFiles.length) {
        const file = directoryFiles[index]
        await showFileContent(currentDirectory, file.name)
        return
      }
    }
    
    // Handle slash commands
    switch (cmd) {
      case '/menu':
      case 'menu':
      case 'm':
        setCurrentMenu('main')
        await showMainMenu()
        break
      case 'x':
      case '/back':
      case 'back':
        if (isDisplayingContent && currentDirectory) {
          // Go back to directory listing
          setIsDisplayingContent(false)
          await showDirectoryListing(currentDirectory)
        } else if (currentMenu === 'directory') {
          // Go back to main menu from directory
          await showMainMenu()
        } else {
          // Default to main menu
          await showMainMenu()
        }
        break
      case '/help':
      case 'help':
      case 'h':
        await showHelp()
        break
      case '/about':
      case 'about':
        await showAbout()
        break
      case '/experience':
      case 'experience':
        await showExperience()
        break
      case '/skills':
      case 'skills':
        await showSkills()
        break
      case '/projects':
      case 'projects':
        await showProjects()
        break
      case '/education':
      case 'education':
        await showEducation()
        break
      case '/contact':
      case 'contact':
        await showContact()
        break
      case '/github':
        window.open('https://github.com/joshua-lossner', '_blank')
        await addLine('Opening GitHub profile...', 'processing')
        break
      case '/linkedin':
        window.open('https://linkedin.com/in/joshua-lossner', '_blank')
        await addLine('Opening LinkedIn profile...', 'processing')
        break
      case '/download':
        await addLine('Resume download feature coming soon...', 'processing')
        break
      case '/voice':
      case 'voice':
        const newAudioState = !audioEnabled
        if (newAudioState) {
          setAudioEnabled(true)
          await addLine('Audio output enabled. Alex will now speak responses aloud.', 'processing')
        } else {
          setAudioEnabled(false)
          await addLine('Audio output disabled.', 'processing')
        }
        break
      case '/clear':
      case 'clear':
        setTerminalLines([])
        setNeedsInputDivider(false)
        break
      case 'exit':
        await addLine('Thank you for visiting. Goodbye!', 'processing')
        setTimeout(() => window.close(), 1000)
        break
      default:
        // If it's not a recognized command, treat it as a question for the AI
        const aiResponse = await callAI(command)
        await typeAIResponse(aiResponse)
    }
  }


  // Handle keyboard navigation like coherenceism.info
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!systemReady || isProcessing) return

      if (e.key === 'Enter') {
        if (currentInput.trim()) {
          const command = currentInput.trim()
          setCurrentInput('')
          setIsProcessing(true)
          
          const runCommand = async () => {
            // Add divider before first user input after main menu
            if (needsInputDivider) {
              await addLine(createBorder('', '─'), 'separator')
              setNeedsInputDivider(false)
            }
            await addLine(`> ${command}`, 'user-input')
            await processCommand(command)
            setIsProcessing(false)
          }
          
          runCommand()
        }
      } else if (e.key === 'Backspace') {
        setCurrentInput(prev => prev.slice(0, -1))
      } else if (e.key === 'ArrowUp') {
        // Scroll up when viewing content
        if (isDisplayingContent && terminalRef.current) {
          e.preventDefault()
          const scrollAmount = 100 // Scroll 100px at a time (about 3-4 lines)
          terminalRef.current.scrollBy({
            top: -scrollAmount,
            behavior: 'smooth'
          })
        }
      } else if (e.key === 'ArrowDown') {
        // Scroll down when viewing content
        if (isDisplayingContent && terminalRef.current) {
          e.preventDefault()
          const scrollAmount = 100 // Scroll 100px at a time (about 3-4 lines)
          terminalRef.current.scrollBy({
            top: scrollAmount,
            behavior: 'smooth'
          })
        }
      } else if (e.key === 'PageUp') {
        // Page up for larger jumps
        if (terminalRef.current) {
          e.preventDefault()
          const scrollAmount = terminalRef.current.clientHeight * 0.8
          terminalRef.current.scrollBy({
            top: -scrollAmount,
            behavior: 'smooth'
          })
        }
      } else if (e.key === 'PageDown') {
        // Page down for larger jumps
        if (terminalRef.current) {
          e.preventDefault()
          const scrollAmount = terminalRef.current.clientHeight * 0.8
          terminalRef.current.scrollBy({
            top: scrollAmount,
            behavior: 'smooth'
          })
        }
      } else if (e.key.length === 1) {
        // Add character to input
        setCurrentInput(prev => prev + e.key)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentInput, isDisplayingContent, systemReady, isProcessing])

  const handleLineClick = (command: string) => {
    if (command && !isProcessing) {
      setCurrentInput(command)
      hiddenInputRef.current?.focus()
    }
  }

  return (
    <div className="min-h-screen bg-terminal-bg p-4 scanline relative">
      <div 
        ref={terminalRef}
        className="max-w-4xl mx-auto h-[calc(100vh-12rem)] overflow-y-auto font-mono text-sm scrollbar-hide"
        onClick={() => hiddenInputRef.current?.focus()}
      >
        {terminalLines.map((line, index) => {
          // Replace tagline placeholder with animated tagline
          if (line.type === 'tagline') {
            return (
              <div
                key={index}
                className={`text-terminal-amber mb-1 ${
                  isGlitching ? 'animate-flicker' : 'animate-pulse-slow'
                }`}
              >
                {taglines[currentTaglineIndex]}
              </div>
            )
          }
          
          return (
            <div
              key={index}
              className={`
                ${line.type === 'error' ? 'text-red-500' : ''}
                ${line.type === 'processing' ? 'text-terminal-amber' : ''}
                ${line.type === 'separator' ? 'text-gray-600' : ''}
                ${line.type === 'user-input' ? 'text-terminal-amber' : ''}
                ${line.type === 'ascii-art' ? 'text-terminal-green whitespace-pre text-xs leading-tight' : ''}
                ${line.type === 'ai-response' ? 'text-green-300' : ''}
                ${line.clickableCommand ? 'hover:text-terminal-amber cursor-pointer transition-colors' : ''}
                mb-1
              `}
              onClick={() => line.clickableCommand && handleLineClick(line.clickableCommand)}
            >
              {line.isMarkdown ? (
                <div className="prose prose-invert prose-sm max-w-none prose-headings:text-terminal-green prose-strong:text-terminal-amber prose-a:text-terminal-green hover:prose-a:text-terminal-amber">
                  <ReactMarkdown>
                    {line.text}
                  </ReactMarkdown>
                </div>
              ) : (
                line.text
              )}
            </div>
          )
        })}
      </div>
      
      {/* Sticky command prompt */}
      {systemReady && (
        <div className="fixed bottom-6 left-0 right-0 bg-black border-t border-terminal-green-dim z-40">
          {/* Terminal-style navigation buttons */}
          {(isDisplayingContent || currentMenu !== 'main') && (
            <div className="border-b border-terminal-green-dim">
              <div className="px-8 py-2 flex items-center gap-2">
                <button
                  onClick={() => processCommand('/menu')}
                  className="px-4 py-1 border border-terminal-green bg-black text-terminal-green hover:bg-terminal-green hover:text-black transition-all duration-200 font-mono text-sm"
                >
                  E<span className="underline decoration-2 underline-offset-1">X</span>IT
                </button>
                
                <div className="flex-1"></div>
                
                <button
                  onClick={() => processCommand('/menu')}
                  className="px-4 py-1 border border-terminal-green bg-black text-terminal-green hover:bg-terminal-green hover:text-black transition-all duration-200 font-mono text-sm"
                >
                  <span className="underline decoration-2 underline-offset-1">M</span>ENU
                </button>
                
                <button
                  onClick={() => processCommand('/help')}
                  className="px-4 py-1 border border-terminal-green bg-black text-terminal-green hover:bg-terminal-green hover:text-black transition-all duration-200 font-mono text-sm ml-2"
                >
                  <span className="underline decoration-2 underline-offset-1">H</span>ELP
                </button>
              </div>
            </div>
          )}
          
          {/* Command prompt area */}
          <div className="px-8 py-3">
            <div className="flex items-center">
              <div className="flex-1">
                {!isProcessing ? (
                  <div className="flex text-terminal-green font-bold brightness-125">
                    <span>&gt; {currentInput}</span>
                    <span className="inline-block w-2 h-4 bg-terminal-green ml-1 animate-flicker">█</span>
                  </div>
                ) : (
                  <div className="text-terminal-amber">
                    Processing...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-terminal-green text-black p-1 flex justify-between text-sm z-50">
        <span className="hidden md:block">{version}</span>
        <span className="md:block flex-1 text-center md:text-left md:flex-initial">
          LOSSNER.TECH {audioEnabled && <span className="ml-2">• AUDIO: ON</span>}
        </span>
        <span className="hidden md:block">STATUS: {isProcessing ? 'PROCESSING...' : isPlaying ? 'SPEAKING...' : 'READY'}</span>
      </div>
      
      <input
        ref={hiddenInputRef}
        type="text"
        value=""
        onChange={() => {}} // Controlled by keyboard handler
        className="absolute -left-full opacity-0"
        autoFocus
      />
      
      {/* Audio element for speech synthesis */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  )
}

export default TerminalResume