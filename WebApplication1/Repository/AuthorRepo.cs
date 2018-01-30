using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PripremaTest1.Models;
using PripremaTest1.Interfaces;
using System.Data.Entity;
namespace PripremaTest1.Repository
{
    public class AuthorRepo : IAuthorRepo
    {
        private ApplicationDbContext db = new ApplicationDbContext();
        public IEnumerable<Author> GetAll()
        {
            return db.Authors;
        }

        public Author GetById(int id)
        {
            var author = db.Authors.Find(id);
            return author;
        }

        public void Add(Author author)
        {
            db.Authors.Add(author);
            db.SaveChanges();
        }

        public void Edit(Author author)
        {
            db.Entry(author).State = EntityState.Modified;
            db.SaveChanges();
        }

        public void Delete(Author author)
        {
            db.Authors.Remove(author);
            db.SaveChanges();
        }

        public bool AuthorExists(int id)
        {
            return db.Authors.Count(x=>x.Id == id) > 0;
        }
    }
}