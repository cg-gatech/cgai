'use client';

import * as React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { BookAIcon, GithubIcon, InfoIcon, TreesIcon } from 'lucide-react';
import Image from 'next/image';

const tutorials: { title: string; href: string; description: string }[] = [
  {
    title: 'Hello Triangle',
    href: '/tutorial/hello-triangle',
    description: 'Hello Triangle',
  },
  {
    title: 'Shader Basis',
    href: '/tutorial/shader-basis',
    description: 'Simple GLSL Shader',
  },
  {
    title: 'Phong Shading',
    href: '/tutorial/phong-shading',
    description: 'Phong Shading Example',
  },
  {
    title: 'SDF Basis',
    href: '/tutorial/sdf-basis',
    description: 'Simple 2D SDF Shader',
  },
  {
    title: 'Google Colab Tutorial',
    href: '/tutorial/colab-tutorial',
    description: 'Google Colab Tutorial',
  },
  {
    title: 'Neural SDF Tutorial',
    href: '/tutorial/neural-sdf-basis',
    description: 'Google Colab Tutorial',
  },
  {
    title: 'Pytorch Tutorial',
    href: '/tutorial/pytorch-tutorial',
    description: 'Pytorch Tutorial',
  },
  {
    title: 'Mass Spring System',
    href: '/tutorial/mass-spring-tutorial',
    description: 'Mass Spring System',
  },
];

const assignments: { title: string; href: string; description: string }[] = [
  {
    title: 'Assignment 0 Demo',
    href: '/assignment/A0',
    description: 'A0 Demo: Ray Tracing',
  },
  {
    title: 'Assignment 0 Doc',
    href: '/assignment/A0_doc',
    description: 'A0 Document: Ray Tracing',
  },
  {
    title: 'Assignment 1A Demo',
    href: '/assignment/A1a',
    description: 'A1a Demo: SDF and Ray Marching',
  },
  {
    title: 'Assignment 1A Doc',
    href: '/assignment/A1a_doc',
    description: 'A1a Document: SDF and Ray Marching',
  },
  {
    title: 'Assignment 1B Demo',
    href: '/assignment/A1b',
    description: 'A1b Demo: Neural Implicit Surface',
  },
  {
    title: 'Assignment 1B Doc',
    href: '/assignment/A1b_doc',
    description: 'A1b Document: Neural Implicit Surface',
  },
  {
    title: 'Assignment 2A Demo',
    href: '/assignment/A2a',
    description: 'A2a Demo: Volumetric Rendering',
  },
  {
    title: 'Assignment 2A Doc',
    href: '/assignment/A2a_doc',
    description: 'A2a Document: Volumetric Rendering',
  },
  {
    title: 'Assignment 2B Demo',
    href: '/assignment/A2b',
    description: 'A2b Demo: Neural Radiance Fields',
  },
  {
    title: 'Assignment 2B Doc',
    href: '/assignment/A2b_doc',
    description: 'A2b Document: Neural Radiance Fields',
  },
  {
    title: 'Assignment 3 Demo',
    href: '/assignment/A3',
    description: 'A3 Demo: Gaussian Splatting',
  },
  {
    title: 'Assignment 3 Doc',
    href: '/assignment/A3_doc',
    description: 'A3 Document: Gaussian Splatting',
  },
  {
    title: 'Assignment 4 Demo',
    href: '/assignment/A4',
    description: 'A4 Demo: Position-based Dynamics',
  },
  {
    title: 'Assignment 4 Doc',
    href: '/assignment/A4_doc',
    description: 'A4 Document: Position-based Dynamics',
  },
  {
    title: 'Final Project Doc',
    href: '/assignment/Final_doc',
    description: 'Final Project Document',
  },
];

export function NavBar() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Tutorials</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              {tutorials.map((items) => (
                <ListItem key={items.title} title={items.title} href={items.href}>
                  {items.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Assignments</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[700px] md:grid-cols-4 lg:w-[800px] ">
              {assignments.map((assignment) => (
                <ListItem
                  key={assignment.title}
                  title={assignment.title}
                  href={assignment.href}
                >
                  {assignment.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {/* Final Project */}
        {/* <NavigationMenuItem>
          <Link
            href="/assignment/Final_doc"
            legacyBehavior
            passHref
          >
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Final Project
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem> */}
        <NavigationMenuItem>
          <Link href="https://github.com/cg-gatech/cgai" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <GithubIcon className="w-4 h-4 mr-2" />
              Github Page
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            href="https://gatech.instructure.com/courses/448080"
            legacyBehavior
            passHref
          >
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Image
                className="mr-2 invert"
                src="/cgai_logo.png"
                alt="CGAI logomark"
                width={16}
                height={16}
              />
              Canvas Page
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        {/*  */}
        <NavigationMenuItem>
          <Link href="/reading-materials" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <BookAIcon className="w-4 h-4 mr-2" />
              Reading Materials
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        {/*  */}
        <NavigationMenuItem>
          <Link href="/course-information" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <InfoIcon className="w-4 h-4 mr-2" />
              Course Overview
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        {/*  */}
        <NavigationMenuItem>
          <Link href="/syllabus" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <TreesIcon className="w-4 h-4 mr-2" />
              Syllabus
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
