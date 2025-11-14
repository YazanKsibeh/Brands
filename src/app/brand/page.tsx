/**
 * Brand Profile Page for LocalStyle Application
 * Manages brand information and settings
 */

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store, Edit, Save, Upload } from 'lucide-react';

export default function BrandPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Brand Profile</h1>
            <p className="text-muted-foreground">
              Manage your brand information, logo, and contact details
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Brand Logo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Store className="h-5 w-5" />
                <span>Brand Logo</span>
              </CardTitle>
              <CardDescription>Upload and manage your brand logo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center w-full h-32 bg-muted rounded-lg border-2 border-dashed border-border">
                <div className="text-center">
                  <Store className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Nova Style Logo</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Upload New Logo
              </Button>
            </CardContent>
          </Card>

          {/* Brand Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Brand Information</CardTitle>
              <CardDescription>Basic information about your brand</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brandName">Brand Name</Label>\n                  <Input id="brandName" defaultValue="Nova Style" />\n                </div>\n                <div className="space-y-2">\n                  <Label htmlFor="brandWebsite">Website</Label>\n                  <Input id="brandWebsite" defaultValue="https://www.novastyle.com" />\n                </div>\n              </div>\n              \n              <div className="space-y-2">\n                <Label htmlFor="brandBio">Brand Description</Label>\n                <textarea\n                  id="brandBio"\n                  className="w-full h-24 px-3 py-2 border border-input bg-background rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"\n                  defaultValue="Nova Style is a contemporary fashion brand that combines modern aesthetics with timeless elegance. Founded in 2020, we specialize in creating premium clothing and accessories that empower individuals to express their unique style."\n                />\n              </div>\n            </CardContent>\n          </Card>\n        </div>\n\n        {/* Contact Information */}\n        <Card>\n          <CardHeader>\n            <CardTitle>Contact Information</CardTitle>\n            <CardDescription>How customers can reach your brand</CardDescription>\n          </CardHeader>\n          <CardContent>\n            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">\n              <div className="space-y-2">\n                <Label htmlFor="contactEmail">Email</Label>\n                <Input id="contactEmail" defaultValue="contact@novastyle.com" />\n              </div>\n              <div className="space-y-2">\n                <Label htmlFor="contactPhone">Phone</Label>\n                <Input id="contactPhone" defaultValue="+1 (555) 123-4567" />\n              </div>\n              <div className="space-y-2">\n                <Label htmlFor="contactAddress">Address</Label>\n                <Input id="contactAddress" placeholder="Business address" />\n              </div>\n            </div>\n          </CardContent>\n        </Card>\n\n        {/* Brand Statistics */}\n        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">\n          <Card>\n            <CardContent className="p-6">\n              <div className="text-2xl font-bold">2020</div>\n              <p className="text-xs text-muted-foreground">Year Founded</p>\n            </CardContent>\n          </Card>\n          <Card>\n            <CardContent className="p-6">\n              <div className="text-2xl font-bold">3</div>\n              <p className="text-xs text-muted-foreground">Branches</p>\n            </CardContent>\n          </Card>\n          <Card>\n            <CardContent className="p-6">\n              <div className="text-2xl font-bold">15</div>\n              <p className="text-xs text-muted-foreground">Staff Members</p>\n            </CardContent>\n          </Card>\n          <Card>\n            <CardContent className="p-6">\n              <div className="text-2xl font-bold">1.2k</div>\n              <p className="text-xs text-muted-foreground">Customers</p>\n            </CardContent>\n          </Card>\n        </div>\n      </div>\n    </DashboardLayout>\n  );\n}