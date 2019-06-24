from flask_appbuilder.security.sqla.models import User
from sqlalchemy import Column, Integer, ForeignKey, String, Sequence, Table
from sqlalchemy.orm import relationship, backref
from flask_appbuilder import Model, Base
from flask_appbuilder.security.views import UserDBModelView
from flask_babel import lazy_gettext
from flask_appbuilder.security.sqla.manager import SecurityManager

# class Doctor(Model):
#     __tablename__ = 'doctors'
#     id = Column(Integer, primary_key=True)
#     name = Column(String(50), unique=True, nullable=False)

#     def __repr__(self):
#         return self.name

# class DoctorUsers(Model):
#     __tablename__ = 'doctor_users'
#     id = Column(Integer, primary_key=True)
#     doctor_id = Column(Integer, ForeignKey('doctors.id'), nullable=False)
#     doctors = relationship("Doctor")
#     user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
#     user = relationship("User")

#     def __repr__(self):
#         return self.doctor_id

# roles_users = Table("doctor_users", Model.metadata,
#                     Column("user_id", Integer, ForeignKey("user.id")),
#                     Column("doctor_id", Integer, ForeignKey("doctor.id")))


class Doctor(Base):

    id = Column(Integer, primary_key=True)

    def __repr__(self):
        return self.id

    # ...


class NewUser(User):
     __tablename__ = 'ab_user_role'
    id = Column(Integer, primary_key=True)

    # ...

    roles = relationship("Doctor",
                         back_populates="user",
                         secondary=roles_users)

    def __repr__(self):
        return self.id


# class NewUser(MyUser):

#     __tablename__ = 'ab_user_role'
#     # role_id = Column(Integer())
#     role_id = Column(Integer, ForeignKey('employee.id'), nullable=False)
#     MyUser = relationship("NewUser")


class MyUserDBModelView(UserDBModelView):
    """
        View that add DB specifics to User view.
        Override to implement your own custom view.
        Then override userdbmodelview property on SecurityManager
    """

    show_fieldsets = [
        (lazy_gettext('User info'), {
            'fields':
            ['username', 'active', 'roles', 'login_count', 'user_id']
        }),
        (lazy_gettext('Personal Info'), {
            'fields': ['first_name', 'last_name', 'email'],
            'expanded': True
        }),
        (lazy_gettext('Audit Info'), {
            'fields': [
                'last_login', 'fail_login_count', 'created_on', 'created_by',
                'changed_on', 'changed_by'
            ],
            'expanded':
            False
        }),
    ]

    user_show_fieldsets = [
        (lazy_gettext('User info'), {
            'fields':
            ['username', 'active', 'roles', 'login_count', 'user_id']
        }),
        (lazy_gettext('Personal Info'), {
            'fields': ['first_name', 'last_name', 'email'],
            'expanded': True
        }),
    ]

    add_columns = [
        'first_name', 'last_name', 'username', 'active', 'email', 'roles',
        'user_id', 'password', 'conf_password'
    ]
    list_columns = [
        'first_name', 'last_name', 'username', 'email', 'active', 'roles'
    ]
    edit_columns = [
        'first_name', 'last_name', 'username', 'active', 'email', 'roles',
        'user_id'
    ]


class MySecurityManager(SecurityManager):
    user_model = NewUser
    userdbmodelview = MyUserDBModelView
