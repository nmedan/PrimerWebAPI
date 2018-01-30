namespace PripremaTest1.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using PripremaTest1.Models;
    internal sealed class Configuration : DbMigrationsConfiguration<PripremaTest1.Models.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(PripremaTest1.Models.ApplicationDbContext context)
        {
            context.Authors.AddOrUpdate(x => x.Id,
               new Author() { Id = 1, Name = "Marko", Surname="Markovic"},
               new Author() { Id = 2, Name = "Jovan", Surname="Jovanovic"},
               new Author() { Id = 3, Name="Ilija", Surname="Ilic"}
               );

            context.Books.AddOrUpdate(x => x.Id,
               new Book() { Id = 1, Title="Putopisi", DatePublished = new DateTime(2010, 9, 1), Cena=200, AuthorId=1 },
               new Book() { Id = 2, Title="Secanja", DatePublished = new DateTime(2012, 7, 1), Cena = 300, AuthorId = 2 },
               new Book() { Id = 3, Title="Zapisi", DatePublished = new DateTime(2014, 11, 1), Cena = 400, AuthorId = 3 }
               );
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //
        }
    }
}
